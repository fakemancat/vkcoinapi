class APIError extends Error {
    /**
     * @param {Object} params - Параметры ошибки
     * @param {Number} params.code - Код ошибки
     * @param {String} params.message - Сообщение ошибки
     */
    constructor(params) {
        const { code, message } = params;

        super(message);

        this.code = code;
        this.message = message;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ParameterError extends Error {
    /**
     * @param {String} parameter - Название параметра
     */
    constructor(parameter) {
        super(`Вы не указали параметр \`${parameter}\``);
    }
}

module.exports = {
    APIError, ParameterError
};