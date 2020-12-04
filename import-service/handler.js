import Dotenv from "dotenv";

import { importProductsFile } from "./src/importProductsFile";
import { importFileParser } from "./src/importFileParser";

Dotenv.config();

export {
    importProductsFile,
    importFileParser,
}
