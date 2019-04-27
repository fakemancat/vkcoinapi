export interface WebhookParams {
  /**
   * Адрес, на который будут отправляться все события
   */
  url: string;

  /**
   * Порт сервера
   */
  port?: number;
}

export interface VKCoinParams {
  /**
   * API-ключ
   */
  key: string;

  /**
   * Токен пользователя
   */
  token: string;

  /**
   * ID пользователя
   */
  userId: number;
}
