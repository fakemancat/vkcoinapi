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
                body: {
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

    /**
     * @param {Number} toUserId - Айди получателя 
     * @param {Number} amount - Количество коинов 
     */
    async sendPayment(toId, amount) {
        if (typeof toId !== 'number') {
            throw new Error('Айди должно быть числом');
        }

        if (typeof amount !== 'number') {
            throw new Error('Сумма перевода должна быть числом');
        }

        const result = await request(
            'https://coin-without-bugs.vkforms.ru/merchant/send/',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    toId,
                    amount,
                    key: this.key,
                    merchantId: this.userId,
                },
                json: true,
                method: 'POST'
            }
        );

        return result;
    }
};