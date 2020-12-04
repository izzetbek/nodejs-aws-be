/**
 * @param event.type
 * @param event.authorizationToken
 * @param event.methodArn
 * @returns {*}
 */
export const basicAuthorizer = (event, { fail, succeed }) => {
    if (event.type !== 'TOKEN') {
        fail('Unauthorized');
    }

    try {
        const encoded = event.authorizationToken.split(' ')[1];
        const buff = Buffer.from(encoded, 'base64');
        const [ username, password ] = buff.toString('utf-8').split(':');
        const storedPassword = process.env[username];
        const effect = storedPassword && storedPassword === password ? 'Allow' : 'Deny';
        succeed(generatePolicy(encoded, event.methodArn, effect));
    } catch (e) {
        fail(`Unauthorized: ${e.message}`);
    }
}

const generatePolicy = (principalId, resource, effect) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Resource: resource,
                Effect: effect,
            }
        ]
    }
});
