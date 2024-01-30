import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import db from "./connection";
import { QueryError, ResultSetHeader } from "mysql2";
import response from "./response";

const app: Express = express();
const port: number = 3000;

app.use(bodyParser.json());

interface IExpense {
  id: Number;
  name: String;
  nominal: Number;
  category: String;
  expenseDate: Date;
}

app.get("/expenses", (req: Request, res: Response) => {
  const sql: string = "SELECT * FROM expense";

  db.query(sql, (err: QueryError, result: IExpense[]) => {
    if (err) {
      response(500, "Invalid data", "Server error", res);
      console.log("SERVER ERROR");
    }

    response(200, result, "GET all expenses list, success!", res);
    console.log("GET all expenses list, OK!");
  });
});

app.get("/expenses/:id", (req: Request, res: Response) => {
  const id: String = req.params.id;
  const sql: string = `SELECT * FROM expense WHERE id = ${id}`;

  db.query(sql, (err: QueryError, result: IExpense[]) => {
    if (err) {
      response(500, "Invalid data", "Server error", res);
      console.log("SERVER ERROR");
    }
    response(200, result, `GET expense data id = ${id}`, res);
    console.log(`GET expense id = ${id}, OK!`);
  });
});

app.get("/expenses/total/category", (req: Request, res: Response) => {
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
});

app.post("/expenses", (req: Request, res: Response) => {
  const { name, nominal, category, expenseDate } = req.body;
  const sql: string = `INSERT INTO expense (name, nominal, category, expense_date) VALUES ('${name}', ${nominal}, '${category}', '${expenseDate}')`;

  db.query(sql, (err: QueryError, result: ResultSetHeader) => {
    if (err) {
      response(500, "Invalid data", "Server error", res);
      console.log("SERVER ERROR");
    }
    if (result.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId,
        details: req.body,
      };
      response(200, data, `ADD new expense, OK`, res);
      console.log("Successfully ADD new expense data!");
    } else {
      response(404, "user not found", `Failed to ADD data`, res);
      console.log("Failed to ADD data");
    }
  });
});

app.put("/expenses/:id", (req: Request, res: Response) => {
  const id: String = req.params.id;
  const { name, nominal, category, expenseDate } = req.body;
  const sql: string = `UPDATE expense SET name = '${name}', nominal = ${nominal}, category = '${category}', expense_date = '${expenseDate}' WHERE id = ${id}`;

  db.query(sql, (err: QueryError, result: ResultSetHeader) => {
    if (err) {
      response(500, "Invalid data", "Server error", res);
      console.log("SERVER ERROR");
    }
    if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        info: result.info,
        details: req.body,
      };
      response(200, data, `UPDATE expense id = ${id}, OK!`, res);
      console.log(`Successfully UPDATE expense with id = ${id}`);
    } else {
      response(404, "user not found", `Failed to UPDATE data`, res);
      console.log("Failed to UPDATE data");
    }
  });
});

app.delete("/expenses/:id", (req: Request, res: Response) => {
  const id: String = req.params.id;
  const sql: string = `DELETE FROM expense WHERE id = ${id}`;

  db.query(sql, (err: QueryError, result: ResultSetHeader) => {
    if (err) {
      response(500, "Invalid data", "Server error", res);
      console.log("SERVER ERROR");
    }
    if (result.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
      };
      response(200, data, `DELETE expense data id = ${id}, OK!,`, res);
      console.log(`Successfully DELETE expense data id = ${id}`);
    } else {
      response(404, "user not found", `Failed to DELETE data`, res);
      console.log("Failed to DELETE data");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app running on port ${port}`);
});
