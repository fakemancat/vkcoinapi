# vkcoinapi
Работа с API VK Coin
# Установка
### Windowns:
* Скачайте и установите последнюю версию [Node.JS](https://nodejs.org/en/download/)
* Создайте в удобном месте папку, например **vkcoin**
* Скачайте [репозиторий](https://github.com/fakemancat/vkcoinapi/archive/master.zip)
* Распакуйте папку vkcoinapi-master в папку **(путь до вашей папки)\vkcoinapi**, например: **C:\Users\fakemancat\vkcoin\vkcoinapi**
* Перейдите в командную строку: Win + R > cmd
* Перейдите в папку: **cd (путь до вашей папки)\vkcoinapi**
* Пропишите: npm i

### Ubuntu:
* Установите Node.JS по [этому](https://www.digitalocean.com/community/tutorials/node-js-ubuntu-16-04-ru) гайду
* Создайте в удобном месте папку, например **vkcoin**: mkdir vkcoin
* Перейдите в неё: cd vkcoin
* Пропишите: git clone https://github.com/fakemancat/vkcoinapi vkcoinapi | cd vkcoinapi | npm i
# Начало работы
Для начала использования, вам нужно создать в своей папке исполняемый файл, пусть это будет **index.js**

Теперь его нужно открыть и импортировать библиотеку:
```js
const VKCOINAPI = require('./vkcoinapi');

const vkcoin = new VKCOINAPI(options = {});
```

|Опция|Тип|Описание|
|-|-|-|
|key|String|Ключ для взаимодействия с API|
|userId|Number|Ваш айди ВК|
|token|String|Ваш [токен](https://vkhost.github.io) ВК|
# Методы
getTransactionList - Получает список ваших транзакций

```js
async function run() {
    const result = await vkcoin.getTransactionList(tx);
    
    console.log(result);
}

run().catch(console.error);
```

|Параметр|Тип|Описание|
|-|-|-|
|tx|Array<Number>|Массив айди переводов для получения ИЛИ [1] - последняя 1000 транзакций, [2] - 100|
#
sendPayment - Делает перевод другому пользователю

```js
async function run() {
    const result = await vkcoin.sendPayment(toId, amount);
    
    console.log(result);
}

run().catch(console.error);
```

|Параметр|Тип|Описание|
|-|-|-|
|toId|Number|Айди получателя|
|amount|Number|Сумма перевода|
#
getLink - Получает ссылку для перевода

```js
function run() {
    const link = vkcoin.getLink(amount, fixation);
    
    console.log(link);
}

run().catch(console.error);
```

|Параметр|Тип|Описание|
|-|-|-|
|amount|Number|Сумма перевода|
|fixation|Boolean|Фиксированная сумма или нет|
#
formatCoins - Делает получаемое из API значение коинов читабельным. Например, приходит значение 1234567890. Этот метод сделает значение таким: 1 234 567,890

Это можно использовать в паре с другим методом:
```js
async function run() {
    const trans = await vkcoin.getTransactionList([2]);

    const fixTrans = trans.response.map((tran) => {
        tran.amount = vkcoin.formatCoins(tran.amount);

        return tran;
    });

    console.log(fixTrans);
}

run().catch(console.error);
```
|Параметр|Тип|Описание|
|-|-|-|
|coins|Number|Входящее значение коинов|
#
getBalance - Получает баланс по айди пользователей

getMyBalance - Получает баланс текущего пользователя

```js
async function run() {
    const balances = await vkcoin.getBalance([1, 100, 236908027]);
    const myBalance = await vkcoin.getMyBalance();

    console.log({ balances, myBalance });
}

run().catch(console.error);
```

Среди этих методов аргумент принимает только getBalance:


|Параметр|Тип|Описание|
|-|-|-|
|userIds|Array<Number>|Массив айди пользователей|
# Updates
**updates** - Позволяет "прослушивать" события в VK Coin. Пока что я реализовал перехват входящего платежа, но вскоре придумаю что-нибудь ещё. И да, впервые работаю с сокетами :)
### Запуск
Для запуска прослушивания есть специальный метод startPolling. Он является асинхронным, поэтому запускать его нужно в асинхронной функции:

```js
async function run() {
    await vkcoin.updates.startPolling();
    
    /* Тут ваши действия со слушателем */
}

run().catch(console.error);
```

Метод не принимает аргументов
#
updates.onTransfer - Перехватывает входящие платежи, принимает один аргумент

```js
async function run() {
    await vkcoin.updates.startPolling();

    vkcoin.updates.onTransfer((event) => {
        console.log(event);
    });
}

run().catch(console.error);
```

event - Объект, который хранит в себе информацию о платеже:

|Параметр|Тип|Описание|
|-|-|-|
|amount|Number|Количество коинов, которые послупили на счёт|
|fromId|Number|Айди плательщика|
|id|Number|Айди платежа|
# Ссылки
* Мой вк: https://vk.com/fakeman.cat_fmc
* Беседа: https://vk.me/join/AJQ1d_JeTA/o0GfCxwihS_6E
