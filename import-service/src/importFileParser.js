import AWS from "aws-sdk";
import csv from "csv-parser";
import response from "../../utils/response";

export const importFileParser = async event => {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const Bucket = 'nodejs-aws-static-2';

    const sqs = new AWS.SQS({ region: 'eu-west-1' });

    try {
        await Promise.all(
            event.Records.map(async record => {
                const Key = record.s3.object.key;
                await new Promise((resolve, reject) => {
                    s3.getObject({ Bucket, Key }).createReadStream()
                        .pipe(csv())
                        .on('data', product => {
                            sqs.sendMessage({
                                QueueUrl: process.env.SQS_URL,
                                MessageBody: JSON.stringify(product),
                            }, error => {
                                if (error) {
                                    reject(error);
                                }
                            });
                        })
                        .on('end', resolve)
                        .on('error', reject);
                });

                await s3.copyObject({
                    Bucket,
                    Key: Key.replace('uploaded', 'parsed'),
                    CopySource: `${Bucket}/${Key}`
                }).promise();

                await s3.deleteObject({ Bucket, Key }).promise();
            })
        );

        return response({ success: true }, 202);
    } catch (e) {
        return response({ error: e.message || 'Unknown error' }, 500);
    }
}
