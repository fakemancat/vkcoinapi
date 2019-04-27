import * as Responses from './responses';
import * as Params from './params';

export class Updates {
  /**
   * @param key - API-ключ
   * @param token - Токен пользователя
   * @param userId - ID пользователя
   */
  constructor(key: string, token: string, userId: number);
  
  /**
   * Запустить прослушивание обновлений
   * @param callback - Callback
   */
  async startPolling(callback?: Function);

  /**
   * Переподключиться к серверу
   */
  async reconnect(): true;

  /**
   * Запустить прослушку событий на свой сервер
   * @param options - Параметры
   */
  async startWebhook(options: Params.WebhookParams);
}

export class API {
  constructor(key: string, userId: number);

  /**
   * Получить список транзакций
   * @param tx - Массив ID транзакций. Подробнее: https://vk.cc/9ka9QS
   */
  async getTransactionList(tx?: Array<number>): Promise<Array<Responses.TransactionResponse>>;

  /**
   * Отправить транзакцию пользователю
   * @param toId - ID получателя
   * @param amount - Сумма перевода
   */
  async sendPayment(toId: number, amount: number): Promise<Responses.PaymentResponse>;

  /**
   * Получить баланс пользователя / пользователей
   * @param userIds - Массив ID пользователей для получения баланса
   */
  async getBalance(userIds: Array<number> | number): Promise<Responses.BalanceResponse>;

  /**
   * Получить баланс текущего пользователя
   */
  async getMyBalance(): Promise<number>;

  /**
   * Изменить название магазина
   * @param name - Новое название магазина
   */
  async setShopName(name: string): Promise<number>;

  /**
   * Превратить количество коинов в читабельное
   * @param coins - Количество коинов
   * @example
   * let coins = 1234567890;
   * vkcoin.api.formatCoins(coins); // 1 234 567,890
   */
  formatCoins(coins: number): string;

  /**
   * Получить ссылку на перевод
   * @param amount - Количество коинов для получения
   * @param fixation - Фиксированная сумма или нет
   */
  getLink(amount: number, fixation: boolean): string;
}

export class VKCoin {
  /**
   * @param options Параметры
   */
  constructor(options: Params.VKCoinParams);

  api: API;
  updates: Updates;
}

export = VKCoin;
