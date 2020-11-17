import response from "../../utils/response";
import isEmpty from "validator/es/lib/isEmpty";
import isInt from "validator/es/lib/isInt";
import { endClient, query, queryOne } from "../../utils/db";
import HttpError from "../../utils/httpError";

const validateData = (title, price, count) => {
    const messages = {};
    if (!title || isEmpty(title)) {
        messages.title = 'Invalid title';
    }

    if (!price || !isInt(price.toString(), { min: 0 })) {
        messages.price = 'Invalid price';
    }

    if (!count || !isInt(count, { min: 0 })) {
        messages.count = 'Invalid count';
    }

    if (messages.length) {
        throw new HttpError(422, messages.join('.'));
    }
}

const insertProduct = async ({ title, description, price, count }) => {
    validateData(title, price, count);

    try {
        await query('BEGIN');
        const inserted = await queryOne(
            'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id',
            [title, description || '', price]
        );
        await query('INSERT INTO stocks (product_id, count) VALUES ($1, $2)', [inserted.id, count]);
        await query('COMMIT');

        return inserted.id;
    } catch (e) {
        await query('ROLLBACK');
        throw e;
    }
}

export const createProduct = async event => {
    // noinspection JSUnresolvedVariable
    console.log({
        path: event.path,
        method: event.httpMethod,
        body: event.body
    });
    try {
        const productId = await insertProduct(JSON.parse(event.body));
        const product = await queryOne(
            'SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON s.product_id = p.id WHERE p.id = $1',
            [productId]
        )
        return response(product, 201);
    } catch (e) {
        return response({ message: e.message }, e.code || 500);
    } finally {
        await endClient();
    }
}
