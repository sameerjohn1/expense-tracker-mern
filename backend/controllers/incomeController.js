import IncomeModel from "../models/incomeModel.js";

export async function addIncome(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newIncome = new IncomeModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income: newIncome,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// to get all the income
export async function getAllIncomes(req, res) {
  const userId = req.user._id;

  try {
    const income = await IncomeModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      income,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
