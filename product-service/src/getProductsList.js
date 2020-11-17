'use strict';

import { endClient, queryAll } from "../../utils/db";
import response from "../../utils/response";

export const getProductsList = async event => {
  // noinspection JSUnresolvedVariable
  console.log({
    path: event.path,
    method: event.httpMethod,
  });
  try {
    const products = await queryAll(
        'SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON s.product_id = p.id'
    );
    return response(products);
  } catch (e) {
    return response({message: e.message}, 500);
  } finally {
    await endClient();
  }
};
