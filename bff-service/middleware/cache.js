const mcache = require('memory-cache');

module.exports.cache = duration => (req, res, next) => {
    if (req.method !== 'GET') {
        next();
    }

    const key = `bff_api_${req.originalUrl || req.url}`;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
        return res.send(cachedBody);
    } else {
        res.sendResponse = res.send;
        res.send = body => {
            mcache.put(key, body, duration * 1000);
            res.sendResponse(body);
        }
    }

    next();
}
