const VKCOINAPI = require('node-vkcoinapi'); // Импорт модуля
const vkcoin = new VKCOINAPI({
    key: 'Тут ключ',
    userId: 123, // Тут ваш ID вк
    token: 'Тут токен'
});

const VK = require('node-vk-bot-api'); // Импорт модуля для бота
const bot = new VK('Тут токен бота (группы)'); // Новый экземпляр

bot.use((ctx, next) => { // Прослушка для каждого события
    if (ctx.message.from_id < 0) return; // Если от ботов, то ничего не делаем

    return next(); // А если всё норм, то идём дальше
});

bot.command(/дайте коинов/i, async (ctx) => { // Прослушка новых сообщений "дайте коинов"
    await vkcoin.api.sendPayment(ctx.message.from_id, 1000000); // Отправляем 1000 коинов пользователю

    return ctx.reply('Мы отправили вам 1000 коинов, можете проверить!'); // Отправляем сообщение
});

bot.startPolling(); // Старт прослушивания
