const request = require('request-promise');

module.exports = (uri, body = {}) => {
    return request({
        uri,
        headers: {
            'Content-Type': 'application/json'
        },
        body,
        json: true,
        method: 'POST'
    });
};