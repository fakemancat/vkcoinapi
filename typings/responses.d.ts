export interface TransactionResponse {
  /**
   * ID транзакции
   */
  id: number;

  /**
   * ID отправителя
   */
  from_id: number;

  /**
   * ID получателя
   */
  to_id: number;

  /**
   * Тип транзакции
   */
  type: number;

  /**
   * Payload
   */
  payload: number;

  /**
   * External ID
   */
  external_id: number;

  /**
   * Дата создания транзакции
   */
  created_at: number;

  /**
   * Сумма передачи
   */
  amount: string;
}

export interface PaymentResponse {
  response: {
    /**
     * ID перевода
     */
    id: number;

    /**
     * Сумма перевода
     */
    amount: number;

    /**
     * Баланс после перевода
     */
    current: number;
  };
}

export interface BalanceResponse {
  response: {
    [key: string]: number;
  }
}
