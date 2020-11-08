import {Client} from "pg";

let client;

const setClient = async () => {
    client = new Client({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    });
    await client.connect();
}

export const getClient = async () => {
    if (!client) {
        await setClient();
    }

    return client;
}

export const query = async (queryExpr, params = []) => {
    const dbClient = await getClient();
    return await dbClient.query(queryExpr, params);
}

export const queryAll = async queryExpr => {
    const res = await query(queryExpr);
    return res.rows;
}

export const queryOne = async (queryExpr, params) => {
    const res = await query(queryExpr, params);
    return res.rows[0];
}

export const endClient = async () => {
    if (client) {
        await client.end();
        client = undefined;
    }
}
