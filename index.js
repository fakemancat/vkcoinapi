const random = require('./functions/random');
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

    /**
     * @param {Number} amount - Количество коинов для получения
     * @param {Boolean} fixation - Фиксированная сумма или нет
     */
    getLink(amount, fixation) {
        if (typeof amount !== 'number') {
            throw new Error('Сумма перевода должна быть числом');
        }

        const payload = random(-2000000000, 2000000000);
        return `https://vk.com/coin#x${this.userId}_${amount}_${payload}${fixation ? '' : '_1'}`;
    }

    /**
     * @param {Array<Number>} userIds - Массив айди пользователей для получения баланса
     */
    async getBalance(userIds) {
        if (!userIds) {
            throw new Error('В аргумент метода нужно указать массив айди пользователей');
        }

        if (!(userIds instanceof Array)) {
            throw new Error('Аргумент <<userIds>> должен быть массивом');
        }

        const result = await request(
            'https://coin-without-bugs.vkforms.ru/merchant/score/',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    key: this.key,
                    merchantId: this.userId,
                    userIds
                },
                json: true,
                method: 'POST'
            }
        );

        return result;
    }

    /**
     * @description Получает баланс текущего пользователя
     */
    async getMyBalance() {
        const result = await request(
            'https://coin-without-bugs.vkforms.ru/merchant/score/',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    key: this.key,
                    merchantId: this.userId,
                    userIds: [this.userId]
                },
                json: true,
                method: 'POST'
            }
        );

        return result.response[this.userId];
    }

    /**
     * @param {Number} coins - Входящее значение коинов
     * @description Делает получаемое из API значение коинов читабельным
     * Например, приходит значение 1234567890. Этот метод сделает значение таким: 1 234 567,890
     */
    formatCoins(coins) {
        return (coins / 1000)
            .toLocaleString()
            .replace(/,/g, ' ')
            .replace(/\./g, ',');
    }
};