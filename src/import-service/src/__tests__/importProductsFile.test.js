import AWS from "aws-sdk-mock";
import { importProductsFile } from "../../handler";
import response from "../../../utils/response";

describe('ImportProductsFile handler', () => {
    const testUrl = 'http://example-url.com';
    beforeEach(() => {
        AWS.mock('S3', 'getSignedUrl', testUrl);
    });
    it('should successfully get signed url', async () => {
        const result = await importProductsFile({queryStringParameters: {name: 'catalog.csv'}});
        expect(result).toEqual(response(testUrl));
    });
});
