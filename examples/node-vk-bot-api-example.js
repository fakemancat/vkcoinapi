const VKCOINAPI = require('node-vkcoinapi'); // Импорт модуля
const vkcoin = new VKCOINAPI({
    key: 'Тут ключ',
    userId: 123, // Тут ваш ID вк
    token: 'Тут токен'
});

const VK = require('node-vk-bot-api'); // Импорт модуля для бота
const bot = new VK(); // Новый экземпляр

bot.use((ctx, next) => { // Прослушка для каждого события
    if (ctx.message.from_id < 0) return; // Если от ботов, то ничего не делаем

    return next(); // А если всё норм, то идём дальше
});

bot.command(/мой баланс/i, async (ctx) => { // Прослушка новых сообщений "мой баланс"
    const result = await vkcoin.api.getBalance([ ctx.message.from_id ]); // Получаем баланс отправителя
    const coins = vkcoin.api.formatCoins(result.response[ctx.message.from_id]); // Делаем его читабельным

    return ctx.reply(`Ваши коины: ${coins}`); // Отправляем сообщение
});

bot.startPolling(); // Старт прослушивания
