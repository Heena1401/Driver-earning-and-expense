const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense'); 

router.post('/', async (req, res) => {
  try {
    const expenses = req.body;

    if (!Array.isArray(expenses)) {
      return res.status(400).json({ message: 'Expected an array of expenses' });
    }

    await Expense.insertMany(expenses);
    res.status(201).json({ message: 'Expenses saved successfully' });
  } catch (error) {
    console.error('Error saving expenses:', error);
    res.status(500).json({ message: 'Error saving expenses' });
  }
});

module.exports = router;
