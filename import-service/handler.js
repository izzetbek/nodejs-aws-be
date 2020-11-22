import Dotenv from "dotenv";

import { importProductsFile } from "./src/importProductsFile";
import { importFileParser } from "./src/importFileParser";
import { catalogBatchProcess } from "./src/catalogBatchProcess";

Dotenv.config();

export {
    importProductsFile,
    importFileParser,
    catalogBatchProcess,
}
