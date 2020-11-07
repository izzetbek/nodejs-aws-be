'use strict';

import productsList from "./productList.json";

export const getProductsList = async () => {
  try {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify(productsList),
    };
  } catch (e) {
    return {
      statusCode: e.code || 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
};
