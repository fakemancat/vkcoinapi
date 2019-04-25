module.exports = (value) => {
    let isJSON;

    try {
        JSON.parse(value);
        isJSON = true;
    } catch(error) {
        isJSON = false;
    }

    return isJSON;
};