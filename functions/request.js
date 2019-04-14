const request = require('request-promise');

module.exports = async(url = '', params = {}) => {
    params.uri = url;
    const result = await request(params);

    return result;
};

