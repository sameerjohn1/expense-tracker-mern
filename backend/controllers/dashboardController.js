import incomeModel from "../models/incomeModel.js";
import expenseModel from "../models/expenseModel.js";

export async function getDashboardOverview(req, res) {
  const userId = req.user._id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    console.log("Fetching dashboard for userId:", userId);
    const incomes = await incomeModel
      .find({
        userId,
      })
      .lean();

    const expenses = await expenseModel
      .find({
        userId,
      })
      .lean();

    console.log(
      `Found ${incomes.length} incomes and ${expenses.length} expenses`,
    );

    const monthlyIncome = incomes.reduce(
      (acc, cur) => acc + Number(cur.amount || 0),
      0,
    );
    const monthlyExpense = expenses.reduce(
      (acc, cur) => acc + Number(cur.amount || 0),
      0,
    );
    const savings = monthlyIncome - monthlyExpense;
    const savingsRate =
      monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

    const recentTransactions = [
      ...incomes.map((i) => ({ ...i, type: "income" })),
      ...expenses.map((e) => ({ ...e, type: "expense" })),
    ].sort((a, b) => {
      const dateA = new Date(b.date || b.createdAt || 0);
      const dateB = new Date(a.date || a.createdAt || 0);
      return dateA - dateB;
    });

    const spendByCategory = {};
    for (const exp of expenses) {
      const cat = exp.category || "Other";
      spendByCategory[cat] =
        (spendByCategory[cat] || 0) + Number(exp.amount || 0);
    }

    const expenseDistribution = Object.entries(spendByCategory).map(
      ([category, amount]) => ({
        category,
        amount,
        percent:
          monthlyExpense === 0
            ? 0
            : Math.round((amount / monthlyExpense) * 100),
      }),
    );

    return res.status(200).json({
      success: true,
      data: {
        monthlyIncome,
        monthlyExpense,
        savings,
        savingsRate,
        recentTransactions,
        spendByCategory,
        expenseDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
    });
  }
}
