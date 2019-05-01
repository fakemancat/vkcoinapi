const VKCOINAPI = require('node-vkcoinapi'); // Подключаю библиотеку, вам нужно будет указать свой путь

const vkcoin = new VKCOINAPI({ // О том, как получить эти значения описано в документации
    key: 'ключ',
    userId: 236908027,
    token: 'токен'
}); 

async function run () {
    const transactions = await vkcoin.api.getTransactionList([2]); // Получаю последние 100 транзакций
    const balances = await vkcoin.api.getBalance([1, 236908027]); // Получаю баланс Дурова и свой, указывать можно до ста ID
    const myBalance = await vkcoin.api.getMyBalance(); // Получаю баланс текущего пользователя
    const result = await vkcoin.api.sendPayment(1, 1000); // Отправляю Дурову 1 коин :D
    const link = vkcoin.api.getLink(10000, true); // Получаю ссылку для платежа в размере 10 коинов без возможности указать своё кол-во (фиксированная цена)
    vkcoin.api.setShopName('Название магазина'); // Изменяю название магазина

    console.log({
        transactions,
        balances,
        myBalance,
        result,
        link
    }); // Выводим в консоль
}

run().catch(console.error);