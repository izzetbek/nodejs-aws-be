'use strict';

import HttpError from "./utils/httpError";
import { endClient, queryOne } from "./utils/db";
import response from "./utils/response";

const getProduct = async id => {
    if (!id) {
        throw new HttpError(400, 'Bad request');
    }

    let product;
    try {
        product = await queryOne(
            'SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON s.product_id = p.id WHERE p.id = $1',
            [id]
        );
    } catch (e) {
        throw new HttpError(500, e.message);
    } finally {
        await endClient();
    }

    if (!product) {
        throw new HttpError(404, 'Product not found');
    }

    return product;
}

export const getProductsById = async event => {
    // noinspection JSUnresolvedVariable
    console.log({
        path: event.path,
        method: event.httpMethod,
    });
    try {
        const product = await getProduct(event.pathParameters.id);
        return response(product);
    } catch (e) {
        return response({ message: e.message }, e.code);
    }
};
