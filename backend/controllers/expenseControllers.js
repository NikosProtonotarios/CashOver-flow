const Expense = require("../schemas/expenseSchema.js");

// _________________get all expenses_______________
let getAllExpenses = async (req, res) => {
  const category = req.params.category;
  try {
    const userId = req.user._id;
    let allExpenses;
    if (category === "all") {
      allExpenses = await Expense.find({ creator: userId }).populate("creator");
      return res.json(allExpenses);
    } else {
      allExpenses = await Expense.find({ category, creator: userId }).populate(
        "creator"
      );
      return res.json(allExpenses);
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    res
      .status(500)
      .send(`Backend: Failed to retrieve all expenses, please try again later`);
  }
};

// _________________get one expense by id__________________________
let getExpenseById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    const expense = await Expense.findById({
      _id: id,
      creator: userId,
    }).populate("creator");

    if (!expense) {
      return res.status(404).json({ message: "Expense doesn't exist" });
    }
    return res.status(200).json({ message: "Here is the expense!", expense });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json(`Backend: Expense not found, please try again later`);
  }
};

// _________________create new expense_______________

let addNewExpense = async (req, res) => {
  const userId = req.user._id;

  try {
    const newExpense = {
      ...req.body,
      creator: userId,
    };
    const createdExpense = await Expense.create(newExpense);

    console.log({
      message: "Expense created successfully",
      data: createdExpense,
    });

    return res.status(201).json({
      message: "Expense created successfully",
      data: createdExpense,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    res
      .status(500)
      .json({ message: `Backend: Failed to create a new expense` });
  }
};

//___________________________update expense data________________
let updateExpense = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  const updatedExpense = req.body;

  try {
    const oldExpense = await Expense.findByIdAndUpdate(
      { _id: id, creator: userId },
      updatedExpense
    ).populate("creator");
    if (!oldExpense) {
      console.log(`Expense does not exist`);
      res.status(404).json({ message: "Expense does not exist" });
    }
    res
      .status(200)
      .json({ message: "Expense updated successfully", data: updatedExpense });
  } catch (error) {
    console.log(`Error updating expense: ${error}`);
    res
      .status(500)
      .json({ message: "Backend: Error updating Expense, try again later!" });
  }
};

//____________________delete expense_______________________

let deleteExpense = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const expenseToDelete = await Expense.findByIdAndDelete({
      _id: id,
      creator: userId,
    });
    if (!expenseToDelete) {
      console.log(`Expense does not exist`);
      res.status(404).json({ message: "Expense does not exist" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(`Backend: Error deleting expense: ${error}`);
    res
      .status(500)
      .json({ message: "Backend: Error deleting expense, try again later!" });
  }
};

//____________________delete all expenses ____________________

let deleteAllExpenses = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Expense.deleteMany({ creator: userId });

    res.status(200).json({
      message: "All expenses deleted successfully",
      deletedCount: `${result.deletedCount} expenses deleted`,
    });
  } catch (error) {
    console.log(`Error deleting expense: ${error}`);
    res
      .status(500)
      .json({ message: "Backend: Error deleting expense, try again later!" });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  addNewExpense,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
};