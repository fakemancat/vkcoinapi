const WebSocket = require('ws');

const koa = require('koa');
const koaBody = require('koa-body');

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
    constructor(key, token, userId) {
        // Конфигурация
        this.key = key;
        this.token = token;
        this.userId = userId;

        // Сервер
        this.url = null;
        this.wss = null;
        this.reconnectTimeout = 5000;

        this.isStarted = false;
        this.hasCallback = false;
        this.callbackMethod = null;

        // Информация
        this.place = null;
        this.digits = null;
        this.online = null;
        this.userTop = null;
        this.groupTop = null;
    }

    /**
     * @async
     * @description Запуск "прослушки"
     */
    async startPolling(callback) {
        if (callback) {
            this.hasCallback = true;
            this.callbackMethod = callback;
        }

        this.isStarted = true;

        this.url = await getURLbyToken(this.token);
        this.wss = formatURL(this.url, this.userId);

        this.ws = new WebSocket(this.wss);

        this.ws.on('open', () => {
            if (callback) callback('Подключено');
        });

        this.ws.on('error', (data) => {
            console.error(
                `На стороне VK Coin возникла ошибка: ${data.message}\n\nПереподключение совершится через ${Math.round(this.reconnectTimeout / 1000)} сек...`
            );

            setTimeout(() => {
                this.reconnect();
            }, this.reconnectTimeout);
        });

        this.ws.on('message', (message) => {
            const jsonMessage = JSON.parse(message);
            
            if (jsonMessage.type === 'INIT') {
                this.place = jsonMessage.place;
                this.digits = jsonMessage.digits;
                this.online = jsonMessage.top.online;
                this.userTop = jsonMessage.top.userTop;
                this.groupTop = jsonMessage.top.groupTop;
            }

            if (/^(?:TR)/i.test(message)) {
                let { amount, fromId, id } = message.match(/^(?:TR)\s(?<amount>.*)\s(?<fromId>.*)\s(?<id>.*)/i).groups;
            
                amount = Number(amount);
                fromId = Number(fromId);
                id = Number(id);

                const event = { amount, fromId, id };

                this.transferHandler(event);
            }

            if (message === 'ALREADY_CONNECTED') {
                if (callback) {
                    callback(
                        `Вы зашли в VK Coin, переподключение совершится через ${Math.round(this.reconnectTimeout / 1000)} сек...`
                    );
                }
            }
        });

        this.ws.on('close', () => {
            if (callback) {
                callback('Соединение разорвано');
            }

            setTimeout(() => {
                this.reconnect();
            }, this.reconnectTimeout);
        });
    }

    /**
     * @async
     * @description - Перезапускает подключение к серверу
     * @returns {Boolean}
     */
    async reconnect() {
        await this.startPolling(this.hasCallback ? this.callbackMethod : null);

        return true;
    }

    /**
     * @async
     * @param {Object} options - Опции WebHook
     * @param {String} options.url - Адрес для получения событий
     * @param {Number} options.port - Порт для создания сервера
     * @returns {Boolean} - true, если запуск успешен
     */
    async startWebHook(options) {
        let { url, port } = options;

        if (!url) {
            throw new Error('Вы не указали адрес для получения событий (url)');
        }

        if (!port) options.port = 8181;

        this.app = new koa();
        this.app.use(koaBody());
        this.app.listen(port);
        this.isStarted = true;

        if (!/^(?:https?)/.test(url)) {
            url = `http://${url}`;
        }

        const result = await request(
            'https://coin-without-bugs.vkforms.ru/merchant/set/',
            {   
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    callback: `${url}:${port}`,
                    key: this.key,
                    merchantId: this.userId
                },
                json: true,
                method: 'POST'
            }
        );

        if (result.response === 'ON') {
            this.app.use((ctx) => {
                ctx.status = 200;

                this.transferHandler(ctx.request.body);
            });

            return true;
        }
        else {
            throw new Error(`Не получилось зарегистрировать Callback: ${result}`);
        }
    }

    /**
     * @param {Function} callback - Функция обратного вызова 
     * @returns {{ amount: Number, fromId: Number, id: Number }}
     * Объект с ключами amount - сумма, fromId - отправитель и id - ID транзакции
     */
    onTransfer(callback) {
        if (!this.isStarted) return;
        this.transferHandler = callback;
    }
}

module.exports = class VKCoin {
    /**
     * @param {Object} options - Опции класса
     * @param {String} options.key - API-ключ
     * @param {Number} options.userId - ID пользователя
     * @param {String} options.token - Токен пользователя
     */
    constructor(options) {
        if (!options.key) throw new Error('Вы не указали ключ');
        if (!options.userId) throw new Error('Вы не указали ID пользователя');
        if (!options.token) throw new Error('Вы не указали токен');

        this.key = options.key;
        this.token = options.token;
        this.userId = options.userId;

        this.updates = new Updates(this.key, this.token, this.userId);
    }

    /**
     * @async
     * @param {Array<Number>} tx - Массив ID транзакций. Подробнее: https://vk.com/@hs-marchant-api
     * @returns {Promise<[{ id: Number, from_id: Number, to_id: Number, amount: String, type: Number, payload: Number, external_id: Number, created_at: Number }]>}
     * Массив с транзакциями
     */
    async getTransactionList(tx = [2]) {
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
     * @async
     * @param {Number} toId - ID получателя 
     * @param {Number} amount - Количество коинов 
     * @property {Object} response - Возвращаемый объект
     * @property {Number} response.id - ID транзакции
     * @property {Number} response.amount - Количество коинов
     * @property {Number} response.current - Текущее количество коинов
     * @returns {Promise<{ response: { id: Number, amount: Number, current: Number } }>}
     * Объект с ключами id, amount, current
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
     * @returns {String} - Ссылка на перевод
     */
    getLink(amount, fixation) {
        if (typeof amount !== 'number') {
            throw new Error('Сумма перевода должна быть числом');
        }

        const payload = random(-2000000000, 2000000000);
        return `https://vk.com/coin#x${this.userId}_${amount}_${payload}${fixation ? '' : '_1'}`;
    }

    /**
     * @async
     * @param {Array<Number>} userIds - Массив ID пользователей для получения баланса
     * @property {Object} response - Возвращаемый объект
     * @returns {Promise<{ response: {} }>}
     * Объект с ID пользователей и их балансами
     */
    async getBalance(userIds) {
        if (!userIds) {
            throw new Error('В аргумент метода нужно указать массив ID пользователей');
        }

        if (!Array.isArray(userIds)) {
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
     * @async
     * @description - Получает баланс текущего пользователя
     * @returns {Number} - Текущий баланс
     */
    async getMyBalance() {
        const result = await this.getBalance([this.userId]);

        return result.response[this.userId];
    }

    /**
     * @param {String} name - Название вашего магазина
     * @description Изменяет название вашего магазина
     * @returns {Promise<{ response: {} }>}
     */
    async setShopName(name) {
        if (!name) {
            throw new Error('Вы не указали новое имя магазина');
        }

        const result = await request(
            'https://coin-without-bugs.vkforms.ru/merchant/set/',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    name,
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
     * @param {Number} coins - Входящее значение коинов
     * @description
     * Делает получаемое из API значение коинов читабельным
     * Например, приходит значение 1234567890. Этот метод сделает значение таким: 1 234 567,890
     * @returns {String} - Отформатированная строка
     */
    formatCoins(coins) {
        coins = Number(coins);
        
        return (coins / 1000)
            .toLocaleString()
            .replace(/,/g, ' ')
            .replace(/\./g, ',');
    }
};