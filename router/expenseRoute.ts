import express, { Router, Request, Response } from "express";
import { QueryError } from "mysql2";
import response from "../response";
import db from "../connection";

const router: Router = express.Router();

interface IExpense {
  id: Number;
  name: String;
  nominal: Number;
  category: String;
  expenseDate: Date;
}

router.get("/category", (req: Request, res: Response) => {
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

router.get("/expense-date", (req: Request, res: Response) => {
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

export default router;
