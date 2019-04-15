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
Для начала использования, вам нужно создать в своей папке исполняемый файл, пусть это будет **index.js**\n
Теперь его нужно открыть и импортировать библиотеку:
```js
const VKCOINAPI = require('./vkcoinapi');

const vkcoin = new VKCOINAPI(options = {});
```

|Опция|Тип|Описание|
|-|-|-|
|key|String|Ключ для взаимодействия с API|
|userId|Number|Ваш айди ВК|
# Методы
getTranList - получает список ваших транзакций

```js
async function run() {
    const result = await vkcoin.getTranList(tx);
    
    console.log(result);
}

run().catch(console.error);
```

|Параметр|Тип|Описание|
|-|-|-|
|tx|Array<Number>|Массив айди переводов для получения ИЛИ [1] - последняя 1000 транзакций, [2] - 100|
#
sendPayment - делает перевод другому пользователю

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
getLink - получет ссылку для перевода

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
# Ссылки
* Мой вк: https://vk.com/fakeman.cat_fmc
* Беседа: https://vk.me/join/AJQ1d_JeTA/o0GfCxwihS_6E
