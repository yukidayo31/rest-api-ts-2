"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response = (statusCode, data, message, res) => {
    res.json({
        statusCode: statusCode,
        data: data,
        message: message,
    });
};
exports.default = response;
