const VKCOINAPI = require('node-vkcoinapi'); // Подключаю библиотеку

const vkcoin = new VKCOINAPI({ // О том, как получить эти значения описано в документации
    key: 'ключ',
    userId: 236908027,
    token: 'токен'
}); 

vkcoin.updates.startWebHook({
    url: 'fakeman-cat.tk', // Тут указываете свой адрес для получения событий
    port: 8181 // Тут указываете порт
});

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
