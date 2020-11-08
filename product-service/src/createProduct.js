import response from "./utils/response";
import isEmpty from "validator/es/lib/isEmpty";
import isInt from "validator/es/lib/isInt";
import { endClient, getClient, query, queryOne } from "./utils/db";
import HttpError from "./utils/httpError";

const validateData = (title, price, count) => {
    const messages = {};
    if (!title || isEmpty(title)) {
        messages.title = 'Invalid title';
    }

    if (!price || !isInt(price, { min: 0 })) {
        messages.price = 'Invalid price';
    }

    if (!count || !isInt(count, { min: 0 })) {
        messages.count = 'Invalid count';
    }

    if (messages.length) {
        throw new HttpError(422, messages.join('.'));
    }
}

export const createProduct = async event => {
    // noinspection JSUnresolvedVariable
    console.log({
        path: event.path,
        method: event.httpMethod,
        body: event.body
    });
    let client;
    try {
        const { title, description, price, count } = event.body;
        validateData(title, price);

        client = await getClient();
        await client.query('BEGIN');

        const productId = await queryOne(
            'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id',
            [title, description || '', price]
        );
        await query('INSERT INTO stocks (product_id, count) VALUES ($1, $2)', [productId, count]);
        const product = await queryOne(
            'SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON s.product_id = p.id WHERE p.id = $1',
            [productId]
        )
        return response(product, 201);
    } catch (e) {
        if (client) {
            await client.query('ROLLBACK');
        }
        return response(e.message, e.code || 500);
    } finally {
        await endClient();
    }
}
