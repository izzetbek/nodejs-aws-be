import AWS from "aws-sdk";
import csv from "csv-parser";
import response from "../../utils/response";

export const importFileParser = async event => {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const Bucket = 'nodejs-aws-static';
    const errors = [];
    for (const record of event.Records) {
        const Key = record.s3.object.key;

        try {
            const s3Obj = await s3.getObject({ Bucket, Key }).promise();

            const results = [];
            s3Obj.createReadStream().pipe(csv())
                .on('data', data => results.push(data))
                .on('error', error => errors.push(error))
                .on('end', () => console.log(results));

            await s3.copyObject({
                Bucket,
                Key: Key.replace('uploaded', 'parsed'),
                CopySource: `${Bucket}/${Key}`
            }).promise();

            await s3.deleteObject({ Bucket, Key }).promise();
        } catch (e) {
            errors.push(e);
        }
    }

    if (errors.length) {
        return response(errors, 500);
    }

    return response({ success: true });
}
