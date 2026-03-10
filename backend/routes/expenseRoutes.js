import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  addExpense,
  getAllExpense,
  updateExpense,
  downloadExpense,
  deleteExpense,
  getExpenseOverview,
} from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);
expenseRouter.get("/get", authMiddleware, getAllExpense);

expenseRouter.put("/update/:id", authMiddleware, updateExpense);
expenseRouter.get("/downloadexcel", authMiddleware, downloadExpense);

expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);
expenseRouter.get("/overview", authMiddleware, getExpenseOverview);

export default expenseRouter;
