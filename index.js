const request = require('./functions/request');

module.exports = class VKCoin {
    /**
     * @param {Object} options - Опции конструктора
     * @param {String} options.key - API Ключ
     * @param {Number} options.userId - Айди пользователя
     */
    constructor(options = {}) {
        if (!options.key || !options.userId) {
            throw new Error('Вы не указали ключ или айди в конструкторе');
        }

        this.key = options.key;
        this.userId = options.userId;
    }

    /**
     * @param {Array<Number>} tx - Массив айди транзакций. Подробнее: https://vk.com/@hs-marchant-api
     */
    async getTranList(tx = [1]) {
        const result = await request(
            'https://coin-without-bugs.vkforms.ru/merchant/tx/',
            {   
                headers: {
                    'Content-Type': 'application/json'
                },
                form: {
                    tx,
                    key: this.key,
                    merchantId: this.userId
                },
                json: true,
                method: 'POST'
            }
        );

        return result;
    }
};