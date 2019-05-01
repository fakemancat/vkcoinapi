const VKCOINAPI = require('node-vkcoinapi'); // Импорт модуля
const vkcoin = new VKCOINAPI({
    key: 'Тут ключ',
    userId: 123, // Тут ваш ID вк
    token: 'Тут токен'
});

const { VK } = require('vk-io'); // Импорт модуля для бота
const vk = new VK(); // Новый экземпляр 

vk.setOptions({ // Устанавливаем опции
    pollingGroupId: 123, // Тут ID группы
    token: 'Тут токен бота (группы)'
});

vk.updates.on(['new_message'], async(msg) => { // Прослушка новых сообщений
    if (msg.isOutbox) return; // Если исходящее, то возвращаем

    if (msg.text === 'мой баланс') { // Если входящее сообщение будет в точности равно 'мой баланс', то...
        const result = await vkcoin.api.getBalance([ msg.senderId ]); // Получаем баланс отправителя
        const coins = vkcoin.api.formatCoins(result.response[msg.senderId]); // Делаем его читабельным

        return msg.send(`Ваши коины: ${coins}`); // Отправляем сообщение
    }
});

vk.updates.startPolling(); // Старт прослушивания
