// @ts-check
'use strict';

class HttpException extends Error {
    /** @type {number} */
    statusCode;

    /**
     * @param {string} message
     * @param {number} [statusCode]
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * @param {string} markdown
 * @returns {string}
 */
function titleMaker(markdown) {
    if (!markdown) return '';
    const [firstLine] = markdown.split('\n');
    return firstLine.replace(/#/g, '').trim();
}

module.exports = {
    HttpException,
    titleMaker,
};
