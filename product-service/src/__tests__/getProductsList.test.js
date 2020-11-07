import { getProductsList } from "../getProductsList";

describe('getProductsList handler', () => {
    it('returns products list correctly', async () => {
        const res = await getProductsList();
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.body).length).toBeGreaterThanOrEqual(3);
    });
});
