import { getProductsById } from "../getProductsById";

describe('getProductsById handler', () => {
    const event = {
        pathParameters: { id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0' },
    };
    it('returns product correctly', async () => {
        const res = await getProductsById(event);
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.body).id).toEqual(event.pathParameters.id);
    });
});
