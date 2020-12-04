import Dotenv from "dotenv";
import { getProductsList } from "./src/getProductsList";
import { getProductsById } from "./src/getProductsById";
import { createProduct } from "./src/createProduct";
import { catalogBatchProcess } from "./src/catalogBatchProcess";

Dotenv.config();

export {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess
}
