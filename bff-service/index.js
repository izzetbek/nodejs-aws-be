const express = require('express');
const axios = require('axios').default;
const cache = require('./middleware/cache');

const app = express();

app.use(express.json());

app.all('/*', cache(120), (req, res) => {
    const recipient = req.originalUrl.split('/')[1];
    const recipientUrl = process.env[recipient];

    if (recipientUrl) {
        axios.request({
            method: req.method,
            url: `${recipientUrl}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        }).then(response => res.json(response.data)).catch(error => {
            console.log(error.message);
            if (error.response) {
                res.status(error.response.status).json(error.response.data);
            } else {
                res.status(500).json({error: error.message});
            }
        });
    } else {
        res.status(502).json({error: 'Cannot process request'});
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
