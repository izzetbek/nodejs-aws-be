import { createProduct } from "../createProduct";
import response from "../../../utils/response";

const testProduct = {
    id: 'r3bhl5l4bg54lubbkfbvfkvb5',
    title: 'Test1',
    description: 'Test1',
    price: 12,
    count: 25
};

jest.mock('validator/es/lib/isEmpty', () => () => false);
jest.mock('validator/es/lib/isInt', () => () => true);
// noinspection JSUnusedGlobalSymbols
jest.mock('../utils/db', () => ({
    query: () => {},
    queryOne: (expr, params) => {
        return params.length > 1 ? { id: testProduct.id } : testProduct;
    },
    endClient: () => {},
}));

describe('createProduct handler', () => {
    it('creates product successfully', async () => {
        const { title, description, price, count } = testProduct;
        const event = {
            body: JSON.stringify({ title, description, price, count })
        }
        const result = await createProduct(event);
        expect(result).toEqual(response(testProduct, 201));
    });
});
