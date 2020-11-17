import AWS from "aws-sdk";
import response from "../../utils/response";

export const importProductsFile = async event => {
    // noinspection JSUnresolvedVariable
    if (!event.queryStringParameters || !event.queryStringParameters.name) {
        return response({ message: 'Bad request' }, 400);
    }
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    try {
        const res = await s3.getSignedUrlPromise('putObject', {
            Bucket: 'nodejs-aws-static',
            Key: `uploaded/${event.queryStringParameters.name}`,
            Expires: 60,
            ContentType: 'text/csv'
        });
        return response(res);
    } catch (e) {
        return response({ message: e.message || 'Unknown error' }, 500);
    }
}
