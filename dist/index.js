"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const connection_1 = __importDefault(require("./connection"));
const response_1 = __importDefault(require("./response"));
const expenseRoute_1 = __importDefault(require("./router/expenseRoute"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.get("/expenses", (req, res) => {
    const sql = "SELECT * FROM expense";
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            (0, response_1.default)(500, "Invalid data", "Server error", res);
            console.log("SERVER ERROR");
        }
        (0, response_1.default)(200, result, "GET all expenses list, success!", res);
        console.log("GET all expenses list, OK!");
    });
});
app.get("/expenses/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM expense WHERE id = ${id}`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            (0, response_1.default)(500, "Invalid data", "Server error", res);
            console.log("SERVER ERROR");
        }
        (0, response_1.default)(200, result, `GET expense data id = ${id}`, res);
        console.log(`GET expense id = ${id}, OK!`);
    });
});
/* app.get("/expenses/total/category", (req: Request, res: Response) => {
  const sql: string =
    "SELECT category, SUM (nominal) AS total_expense FROM expense GROUP BY category";

  db.query(sql, (err: QueryError, result: IExpense[]) => {
    if (err) {
      response(500, "Invalid data", "Server error", res);
      console.log("SERVER ERROR");
    }
    response(200, result, `GET total expense data by category`, res);
    console.log(`GET total expense grouped by category`);
  });
});

app.get("/expenses/total/expense-date", (req: Request, res: Response) => {
  const sql: string =
    "SELECT expense_date, SUM (nominal) AS total_expense FROM expense GROUP BY expense_date";

  db.query(sql, (err: QueryError, result: IExpense[]) => {
    if (err) {
      response(500, "Invalid data", "Server error", res);
      console.log("SERVER ERROR");
    }
    response(200, result, `GET total expense data by date`, res);
    console.log(`GET total expense grouped by date`);
  });
}); */
// ALTERNATIVE FOR GET TOTAL EXPENSE BY CATEGORY & DATE
// USING EXPRESS ROUTER
app.use("/expenses/total", expenseRoute_1.default);
app.post("/expenses", (req, res) => {
    const { name, nominal, category, expenseDate } = req.body;
    const sql = `INSERT INTO expense (name, nominal, category, expense_date) VALUES ('${name}', ${nominal}, '${category}', '${expenseDate}')`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            (0, response_1.default)(500, "Invalid data", "Server error", res);
            console.log("SERVER ERROR");
        }
        if (result.affectedRows) {
            const data = {
                isSuccess: result.affectedRows,
                id: result.insertId,
                details: req.body,
            };
            (0, response_1.default)(200, data, `ADD new expense, OK`, res);
            console.log("Successfully ADD new expense data!");
        }
        else {
            (0, response_1.default)(404, "user not found", `Failed to ADD data`, res);
            console.log("Failed to ADD data");
        }
    });
});
app.put("/expenses/:id", (req, res) => {
    const id = req.params.id;
    const { name, nominal, category, expenseDate } = req.body;
    const sql = `UPDATE expense SET name = '${name}', nominal = ${nominal}, category = '${category}', expense_date = '${expenseDate}' WHERE id = ${id}`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            (0, response_1.default)(500, "Invalid data", "Server error", res);
            console.log("SERVER ERROR");
        }
        if (result === null || result === void 0 ? void 0 : result.affectedRows) {
            const data = {
                isSuccess: result.affectedRows,
                info: result.info,
                details: req.body,
            };
            (0, response_1.default)(200, data, `UPDATE expense id = ${id}, OK!`, res);
            console.log(`Successfully UPDATE expense with id = ${id}`);
        }
        else {
            (0, response_1.default)(404, "user not found", `Failed to UPDATE data`, res);
            console.log("Failed to UPDATE data");
        }
    });
});
app.delete("/expenses/:id", (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM expense WHERE id = ${id}`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            (0, response_1.default)(500, "Invalid data", "Server error", res);
            console.log("SERVER ERROR");
        }
        if (result.affectedRows) {
            const data = {
                isSuccess: result.affectedRows,
            };
            (0, response_1.default)(200, data, `DELETE expense data id = ${id}, OK!,`, res);
            console.log(`Successfully DELETE expense data id = ${id}`);
        }
        else {
            (0, response_1.default)(404, "user not found", `Failed to DELETE data`, res);
            console.log("Failed to DELETE data");
        }
    });
});
app.listen(port, () => {
    console.log(`Example app running on port ${port}`);
});
