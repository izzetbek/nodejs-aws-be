import AWS from "aws-sdk";
import isEmpty from "validator/es/lib/isEmpty";
import isInt from "validator/es/lib/isInt";
import { query, queryOne } from "./utils/db";
import response from "../../utils/response";
import HttpError from "../../utils/httpError";

const validateData = product => {
    const messages = {};
    const { title, price, count } = product;

    if (!title || isEmpty(title)) {
        messages.title = 'Invalid title';
    }

    if (!price || !isInt(price.toString(), { min: 0 })) {
        messages.price = 'Invalid price';
    }

    if (!count || !isInt(count, { min: 0 })) {
        messages.count = 'Invalid count';
    }

    if (messages.length) {
        throw new HttpError(422, messages.join('.'));
    }
}

export const catalogBatchProcess = async event => {
    try {
        const failed = [];
        await Promise.all(
            event.Records.map(async ({ body }) => {
                const product = JSON.parse(body);
                validateData(product);
                const { title, description, price, count } = product;
                try {
                    await query('BEGIN');
                    const inserted = await queryOne(
                        'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id',
                        [title, description || '', price]
                    );
                    await query('INSERT INTO stocks (product_id, count) VALUES ($1, $2)', [
                        inserted.id,
                        count,
                    ]);
                    await query('COMMIT');
                } catch (e) {
                    await query('ROLLBACK');
                    failed.push({ product, error: e.message });
                }
            })
        );

        const sns = new AWS.SNS({ region: 'eu-west-1' });
        await sns.setSubscriptionAttributes({
            AttributeName: 'success',
            AttributeValue: event.Records.length > failed.length,
            SubscriptionArn: process.env.SNS_SUBSCRIPTION_ARN,
        }).promise();
        await sns.setSubscriptionAttributes({
            AttributeName: 'success',
            AttributeValue: event.Records.length > failed.length,
            SubscriptionArn: process.env.SNS_FAIL_SUBSCRIPTION_ARN,
        }).promise();
        const res = await sns.publish({
            Subject: 'Products import',
            Message: JSON.stringify({ count: event.Records.length, failed: failed.length }),
            TopicArn: process.env.SNS_ARN,
        }, (err, data) => {
            return err ? err.message : data.MessageId;
        }).promise();

        console.log(res);

        return response({ message: 'Success' }, 201);
    } catch (e) {
        console.log(e);
        return response({ message: e.message || 'Something went wrong' }, 500);
    }
}
