const VKCOINAPI = require('node-vkcoinapi'); // Подключаю библиотеку, вам нужно будет указать свой путь

const vkcoin = new VKCOINAPI({ // О том, как получить эти значения описано в документации
    key: 'ключ',
    userId: 236908027,
    token: 'токен'
}); 

async function run () {
    await vkcoin.updates.startPolling(console.log); // Подключение к серверу / заупск

    vkcoin.updates.onTransfer((event) => {
        const { amount, fromId, id } = event;

        /**
         * amount - количество коинов, которые поступили
         * fromId - ID отправителя
         * id - ID платежа
         */

        const score = vkcoin.api.formatCoins(amount);

        console.log(
            `Поступил платёж (${id}) от https://vk.com/id${fromId} в размере ${score} коинов`
        );

        /* Тут можно выполнять свои действия */
    });
}

run().catch(console.error);