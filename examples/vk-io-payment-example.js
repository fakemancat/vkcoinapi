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

    if (msg.text === 'дайте коинов') { // Если входящее сообщение будет в точности равно 'дайте коинов', то...
        await vkcoin.api.sendPayment(msg.senderId, 1000000); // Отправляем 1000 коинов пользователю

        return msg.send('Мы отправили вам 1000 коинов, можете проверить!'); // Отправляем сообщение
    }
});

vk.updates.startPolling(); // Старт прослушивания
