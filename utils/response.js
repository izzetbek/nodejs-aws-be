const response = (body = {}, statusCode = 200) => {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "https://d3hmyqwjwvay0w.cloudfront.net",
            "Access-Control-Allow-Methods": "OPTIONS, POST, PUT, GET, DELETE",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(body),
    }
}

export default response;
