const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  type: String,       
  amount: Number,
  date: Date
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
