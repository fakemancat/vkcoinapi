const request = require('./request');

module.exports = async(token) => {
    const result = await request(`https://api.vk.com/method/apps.get?access_token=${token}&app_id=6915965&v=5.95`);

    if (result.error) {
        throw new Error(
            'Не удалось получить ссылку на приложение. Попробуйте переполучить токен'
        );
    }

    const { mobile_iframe_url } = result.response.items[0];

    if (!mobile_iframe_url) {
        throw new Error(
            'Токен нужно получить от приложения "Клевер"'
        );
    }

    return mobile_iframe_url;
};