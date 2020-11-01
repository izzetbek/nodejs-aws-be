'use strict';

import HttpError from "./httpError";
import productsList from "./productList.json";

const getProduct = id => {
    if (!id) {
        throw new HttpError(400, 'Bad request');
    }

    // noinspection JSUnresolvedFunction
    const product = productsList.find(product => product.id === id);
    if (!product) {
        throw new HttpError(404, 'Product not found');
    }

    return product;
}

export const getProductsById = async event => {
    try {
        const product = getProduct(event.pathParameters.id);
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
            },
            body: JSON.stringify(product),
        };
    } catch (e) {
        return {
            statusCode: e.code || 500,
            body: JSON.stringify({ message: e.message }),
        }
    }
};
