"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../response"));
const connection_1 = __importDefault(require("../connection"));
const router = express_1.default.Router();
router.get("/category", (req, res) => {
    const sql = "SELECT category, SUM (nominal) AS total_expense FROM expense GROUP BY category";
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            (0, response_1.default)(500, "Invalid data", "Server error", res);
            console.log("SERVER ERROR");
        }
        (0, response_1.default)(200, result, `GET total expense data by category`, res);
        console.log(`GET total expense grouped by category`);
    });
});
router.get("/expense-date", (req, res) => {
    const sql = "SELECT expense_date, SUM (nominal) AS total_expense FROM expense GROUP BY expense_date";
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            (0, response_1.default)(500, "Invalid data", "Server error", res);
            console.log("SERVER ERROR");
        }
        (0, response_1.default)(200, result, `GET total expense data by date`, res);
        console.log(`GET total expense grouped by date`);
    });
});
exports.default = router;
