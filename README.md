# node-vkcoinapi
Модуль для работы с API VK Coin

[![npm package](https://nodei.co/npm/node-vkcoinapi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-vkcoinapi/)
<p>
<a href="https://www.npmjs.com/package/node-vkcoinapi"><img src="https://img.shields.io/npm/v/node-vkcoinapi.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/node-vkcoinapi"><img src="https://img.shields.io/npm/dt/node-vkcoinapi.svg" alt="Downloads"></a>
</p>

### Особенности:
* Реализованы все методы официального API
* Удобная документация и хорошая тех. поддержка
* Возможность получения платежей в режиме реального времени
* Активные обновления 
* Не тянет за собой много библиотек
* Есть своя беседа для обсуждения обновлений/багов

### Планы:
- [X] Сделать WebHooks
- [ ] Сделать гайды по установке и использованию на YouTube
- [X] Сделать папку с примерами
# Установка
### Windows:
* Скачайте и установите последнюю версию [Node.JS](https://nodejs.org/en/download/)
* Создайте в удобном месте папку, например **vkcoin**
* Перейдите в командную строку: Win + R > cmd
* Перейдите в папку: **cd (путь до вашей папки)**
* Пропишите: npm i node-vkcoinapi

### Ubuntu:
* Установите Node.JS по [этому](https://www.digitalocean.com/community/tutorials/node-js-ubuntu-16-04-ru) гайду
* Создайте в удобном месте папку, например **vkcoin**
* Перейдите в папку: **cd (путь до вашей папки)**
* Пропишите: npm i node-vkcoinapi
# Начало работы
Для начала использования, вам нужно создать в своей папке исполняемый файл, пусть это будет **index.js**

Теперь его нужно открыть и импортировать библиотеку:
```js
const VKCOINAPI = require('node-vkcoinapi');

const vkcoin = new VKCOINAPI(options = {});
```

|Опция|Тип|Описание|
|-|-|-|
|key|String|Ключ для взаимодействия с API|
|userId|Number|Ваш айди ВК|
|token|String|Ваш токен|

### Где взять эти значения
* Получение ключа (key): [описано в начале этой статьи](https://vk.com/@hs-marchant-api)
* Получение айди вк (userId):

Откройте свою аватарку и в адресной строке вы увидите подобное: **https://vk.com/fakeman.cat_fmc?z=photo236908027_456259706%2Falbum236908027_0%2Frev**

Вашим айди будет являться число после слова **photo**. В этом случае **236908027**

* Получение токена (token):

Откройте [эту](https://oauth.vk.com/authorize?client_id=6378721&scope=1073737727&redirect_uri=https://api.vk.com/blank.html&display=page&response_type=token&revoke=1) ссылку и нажмите разрешить

После этого в адресной строке будет подобное: **https://api.vk.com/blank.html#access_token=xxxxxxxxxxxx&expires_in=0&user_id=user_id&email=email**

Токеном будет являться строка от **access_token** до **&expires**. В этом случае **xxxxxxxxxxxx**
# API
getTransactionList - Получает список ваших транзакций

```js
async function run() {
    const result = await vkcoin.api.getTransactionList(tx);
    
    console.log(result);
}

run().catch(console.error);
```

|Параметр|Тип|Описание|
|-|-|-|
|tx|Array<Number>|Массив айди переводов для получения ИЛИ [1] - последняя 1000 транзакций, [2] - 100|
#
sendPayment - Делает перевод другому пользователю (в десятичных долях)

```js
async function run() {
    const result = await vkcoin.api.sendPayment(toId, amount); // 1 коин = 1000 ед.
    
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
    const link = vkcoin.api.getLink(amount, fixation);
    
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
    const trans = await vkcoin.api.getTransactionList([2]);

    const fixTrans = trans.response.map((tran) => {
        tran.amount = vkcoin.api.formatCoins(tran.amount);

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
    const balances = await vkcoin.api.getBalance([1, 100, 236908027]);
    const myBalance = await vkcoin.api.getMyBalance();

    console.log({ balances, myBalance });
}

run().catch(console.error);
```

Среди этих методов аргумент принимает только getBalance:


|Параметр|Тип|Описание|
|-|-|-|
|userIds|Array<Number>|Массив айди пользователей|
#
setShopName - Меняет название магазина

```js
async function run() {
    const result = await vkcoin.api.setShopName(name);
    
    console.log(result);
}

run().catch(console.error);
```

|Параметр|Тип|Описание|
|-|-|-|
|name|String|Новое имя для магазина|
# Updates
**updates** - Позволяет "прослушивать" события в VK Coin. Пока что я реализовал перехват входящего платежа, но вскоре придумаю что-нибудь ещё. И да, впервые работаю с сокетами :)
### Запуск
Для запуска прослушивания есть 2 метода: startPolling и startWebHook
#
startPolling - Запускает обмен запросами между клиентом и сервером в режиме реального времени (WebSocket). Является лучшим и быстрым способом получения событий:
    
```js
async function run() {
    await vkcoin.updates.startPolling(callback);
    
    /* Тут ваши действия со слушателем */
}

run().catch(console.error);
```

|Параметр|Тип|Описание|
|-|-|-|
|callback|Function|Функция обратного вызова, принимает в себя аргумент **event**|

Советую в аргумент callback вставлять **console.log** или любой другой метод для отслеживания действий сокетов, например можно дебажить методом отправки сообщения ВК:

```js
vkcoin.updates.startPolling(async(event) => {
    await vk.api.messages.send({ // Используется vk-io в качестве примера
        user_id: vkcoin.merchantId, // Тут ваш ID
        message: `Polling: ${event}`
    });

    console.log(event);

    /* Тут ваши действия со слушателем */
});
```

Например: Вы запустили polling и потом зашли в VK Coin. Срабатывает автопереподключение к серверу:

```
> Подключено
> Вы зашли в VK Coin, переподключение совершится через 5 сек...
> Соединение разорвано
> Подключено
```
#
startWebHook - Запускает сервер на 8181 порте для получения событий. Может не работать на Windows и является неоптимальным способом получения событий. В этом случае можно обойтись без асинхронной функции:

```js
vkcoin.updates.startWebHook(options = {});

/* Тут ваши действия со слушателем */
```

|Опция|Тип|Описание|
|-|-|-|
|url|String|Адрес вашего сервера для получения событий|
|port|Number|Порт для запуска сервера (8181 - по умолчанию)|
|path|String|Путь вашего хука (/ - по умолчанию)|

При использовании startWebHook, вы лишаетесь многого: получение топов, места, онлайна и информации об объёме рынка. Всё это можно получить при использовании startPolling
### События
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

Или

```js
vkcoin.updates.startPolling(async(data) => {
    console.log(data);
    
    vkcoin.updates.onTransfer((event) => {
        console.log(event);
    });
});
```

Или

```js
vkcoin.updates.startWebHook({
    url: 'fakeman-cat.tk', // Тут ваша ссылка
});

vkcoin.updates.onTransfer((event) => {
    console.log(event);
});
```

event - Объект, который хранит в себе информацию о платеже:

|Параметр|Тип|Описание|
|-|-|-|
|amount|Number|Количество коинов, которые послупили на счёт|
|fromId|Number|Айди плательщика|
|id|Number|Айди платежа|

Стоит отметить, что startWebHook получает только платежи по ссылке.

Я опять же советую использовать startPolling
### Методы и прочее
reconnectTimeout - Значение тайм-аута для переподключения

```js
vkcoin.updates.reconnectTimeout = 10000; // Сменил на 10 скунд
```

По умолчанию это значение равно 5000 (5 секунд)
#
reconnect - Метод переподключения сервера для Longpoll. Использоуется в самой библиотеке для автопереподключения, но в своём коде его также можно использовать.

```js
async function run() {
    await vkcoin.updates.startPolling(console.log);

    try {
        /* Тут код, который может выдать ошибку */
    } catch(error) {
        await vkcoin.updates.reconnect(); // Выполняю переподключение

        console.error(`Ошибка: ${error}`);
    }
}

run();
```

Стоит сказать, что при переподключении во время работы поллинга новое подключение будет перебивать первое и потом наоброт. Так будет идти бесконечно, пока вы не остановите код. Так что **reconnect** стоит использовать, если вы отключились от сервера, а лучше вообще не трогать :)
#
Полезная информация - Если вы подкючились через startLongpoll, то в качестве бонуса вы можете узнать много полезного:
* Своё место в топе
* Объём рынка
* Сумма переводов за 5 минут
* Онлайн в данный момент
* Топ пользователей
* Топ сообществ

```js
const { updates } = vkcoin;

updates.startPolling(console.log).then(async() => {
    const { place, online, digits, userTop, groupTop } = updates;

    console.log({ place, online, digits, userTop, groupTop });
});
```

Теперь пройдусь по каждому параметру:

|Параметр|Тип|Описание|
|-|-|-|
|place|Number|Ваше место в топе|
|online|Number|Онлайн пользователей в данный момент|
|digits|Array<Object>|Информация о рынке и сумме переводов. Подробнее: см. ниже|
|userTop|Array<Object>|Топ пользователей. Подробнее: см. ниже|
|groupTop|Array<Object>|Топ сообществ. Подробнее: см. ниже|

```digits```:

|Параметр|Тип|Описание|
|-|-|-|
|description|String|Описание дигита|
|value|Number|Значение дигита|
|trend|Number|На сколько изменилось значение переводов за 5 минут|

```userTop```:

|Параметр|Тип|Описание|
|-|-|-|
|id|Number|ID Пользователя|
|score|Number|Баланс|
|first_name|String|Имя|
|last_name|String|Фамилия|
|is_closed|Boolean|Закрыт ли аккаунт|
|can_access_closed|Boolean|Может ли текущий пользователь видеть профиль при is_closed = true|
|photo_200|String<URI>|Ссылка на аватарку|
|link|String<URI>|Ссылка на профиль|

```groupTop```:

|Параметр|Тип|Описание|
|-|-|-|
|id|Number|ID сообщества|
|score|Number|Баланс|
|name|String|Имя сообщества|
|screen_name|String|Короткий адрес|
|is_closed|Number|Закрыта ли группа|
|type|String|Тип сообщества (паблик, страница, группа)|
|photo_200|String<URI>|Аватарка сообщества|
|link|String<URI>|Ссылка на сообщество|

Так же скорее всего, все значения будут равны ```null```, потому что клиент **ws** не успевает подключиться. Для решения этой проблемы могу посоветовать сделать ```delay``` функцию и интегрировать в метод:

```js
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const { updates } = vkcoin;

updates.startPolling(console.log).then(async() => {
    await delay(1000);

    const { place, online, digits, userTop, groupTop } = updates;
    console.log({ place, online, digits, userTop, groupTop });
});
```

Для тех, кто не понял. Так как подключение не успевает за получением значений, мы его задерживаем функцией ```delay``` на 1 секунду и тогда всё успевает получиться.
# Ссылки
* [Моя ссылка VK](https://vk.com/fakeman.cat_fmc)
* [Беседа](https://vk.me/join/AJQ1d_JeTA/o0GfCxwihS_6E)
