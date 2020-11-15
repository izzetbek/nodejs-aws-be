import AWS from "aws-sdk";
import response from "../../utils/response";

export const importProductsFile = async event => {
    if (!event.query || !event.query.name) {
        return response({ message: 'Bad request' }, 400);
    }

    const s3 = new AWS.S3({ region: 'eu-west-1' });
    try {
        const res = await s3.getSignedUrlPromise('putObject', {
            Bucket: 'nodejs-aws-static',
            Key: `uploaded/${event.query.name}`,
            Expires: 60,
            ContentType: 'text/csv'
        });

        return response(res);
    } catch (e) {
        console.log(e);
        return response({ message: e.message }, 500);
    }
}
