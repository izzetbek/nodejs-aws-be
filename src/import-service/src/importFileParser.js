import AWS from "aws-sdk";
import csv from "csv-parser";
import response from "../../utils/response";

export const importFileParser = event => {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const Bucket = 'nodejs-aws-static';
    const errors = [];
    for (const record of event.Records) {
        const Key = record.s3.object.key;

        s3.getObject({ Bucket, Key }).createReadStream()
            .pipe(csv())
            .on('data', data => console.log(data))
            .on('end', async () => {
                await s3.copyObject({
                    Bucket,
                    Key: Key.replace('uploaded', 'parsed'),
                    CopySource: `${Bucket}/${Key}`
                }).promise();

                await s3.deleteObject({ Bucket, Key }).promise();
            })
            .on('error', error => errors.push(error));
    }

    if (errors.length) {
        return response(errors, 500);
    }

    return response({ success: true });
}
