import AWS from "aws-sdk-mock";
import { catalogBatchProcess } from "../catalogBatchProcess";
import response from "../../../utils/response";

jest.mock('validator/es/lib/isEmpty', () => () => false);
jest.mock('validator/es/lib/isInt', () => () => true);
jest.mock('../utils/db', () => ({
    query: () => {},
    queryOne: () => ({id: 'r3bhl5l4bg54lubbkfbvfkvb5'})
}));
AWS.mock('SNS', 'publish', 't5gjgj5kb6k5bkuuukubuib4');
AWS.mock('SNS', 'setSubscriptionAttributes', 't5gjgj5kb6k5bkuuukubuib4');

describe('CatalogBatchProcess handler', () => {
    it('should correctly parse csv file', async () => {
        const event = {
            Records: [
                { body: JSON.stringify({title: 'test1', description: 'test1', price: 10, count: 10}) },
                { body: JSON.stringify({title: 'test2', description: 'test2', price: 12, count: 12}) },
            ]
        }
        const result = await catalogBatchProcess(event);
        expect(result).toEqual(response({ message: 'Success' }, 201));
    });
})
