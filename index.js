const WebSocket = require('ws');

const random = require('./functions/random');
const request = require('./functions/request');
const formatURL = require('./functions/formatURL');
const getURLbyToken = require('./functions/getURLbyToken');

/**
 *  Сильно извиняюсь за сущий говнокод в классе Updates. Понимаю, глазам больно...
 *  Впервые работаю с вебсокетами и realtime в принципе
 *  В будущем 100% будет рефактор кода, когда я начну больше разбираться в этом :)
 */
class Updates {
    /**
     * @param {String} token - Токен пользователя 
     * @param {Number} userId - ID пользователя 
     */
    constructor(token, userId) {
        this.token = token;
        this.userId = userId;
    }

    /**
     * @description Запуск "прослушки"
     */
    async startPolling() {
        const url = await getURLbyToken(this.token);
        const wss = formatURL(url, this.userId);

        this.ws = new WebSocket(wss);

        this.ws.onopen = () => {
            console.log('Polling started');
        };

        this.ws.onerror = (data) => {
            console.error(`На стороне VK Coin возникла ошибка: ${data.message}`);
        };
    }

    /**
     * @param {Function} callback - Функция обратного вызова 
     * @description Принимает в себя аргументы amount, fromId, id
     */
    onTransfer(callback) {
        if (!this.ws) return;

        this.ws.onmessage = (data) => {
            const message = data.data;
            if (!/^(?:TR)/i.test(message)) return;
            
            let { amount, fromId, id } = message.match(/^(?:TR)\s(?<amount>.*)\s(?<fromId>.*)\s(?<id>.*)/i).groups;
            
            amount = Number(amount);
            fromId = Number(fromId);
            id = Number(id);

            const event = { amount, fromId, id };

            return callback(event);
        };
    }
}

module.exports = class VKCoin {
    /**
     * @param {Object} options - Опции конструктора
     * @param {String} options.key - API Ключ
     * @param {Number} options.userId - ID пользователя
     * @param {String} options.token - Токен пользователя
     */
    constructor(options = {}) {
        if (!options.key) throw new Error('Вы не указали ключ');
        if (!options.userId) throw new Error('Вы не указали ID пользователя');
        if (!options.token) throw new Error('Вы не указали токен');

        this.key = options.key;
        this.token = options.token;
        this.userId = options.userId;

        this.updates = new Updates(this.token, this.userId);
    }

    /**
     * @param {Array<Number>} tx - Массив ID транзакций. Подробнее: https://vk.com/@hs-marchant-api
     */
    async getTransactionList(tx = [1]) {
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
     * @param {Number} toUserId - ID получателя 
     * @param {Number} amount - Количество коинов 
     */
    async sendPayment(toId, amount) {
        if (typeof toId !== 'number') {
            throw new Error('ID должно быть числом');
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
     * @param {Array<Number>} userIds - Массив ID пользователей для получения баланса
     */
    async getBalance(userIds) {
        if (!userIds) {
            throw new Error('В аргумент метода нужно указать массив ID пользователей');
        }

        if (!(userIds instanceof Array)) {
            throw new Error('Аргумент `userIds` должен быть массивом');
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
        coins = Number(coins);
        
        return (coins / 1000)
            .toLocaleString()
            .replace(/,/g, ' ')
            .replace(/\./g, ',');
    }
};