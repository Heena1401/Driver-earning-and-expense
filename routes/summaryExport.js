const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const Earnings = require('../models/Earnings');
const Expenses = require('../models/Expense');

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(d.setDate(diff));
}

router.get('/weekly', async (req, res) => {
  const startDate = getStartOfWeek(new Date());
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  try {
    const earnings = await Earnings.find({ date: { $gte: startDate, $lt: endDate } });
    const expenses = await Expenses.find({ date: { $gte: startDate, $lt: endDate } });

    const summaryMap = {};
    earnings.forEach(e => {
      const date = formatDate(e.date);
      if (!summaryMap[date]) summaryMap[date] = { earnings: 0, expenses: 0 };
      summaryMap[date].earnings += (e.uber || 0) + (e.ola || 0) + (e.rapido || 0);
    });
    expenses.forEach(ex => {
      const date = formatDate(ex.date);
      if (!summaryMap[date]) summaryMap[date] = { earnings: 0, expenses: 0 };
      summaryMap[date].expenses += ex.amount || 0;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Weekly_Summary`);
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Total Earning', key: 'earning', width: 15 },
      { header: 'Total Expenses', key: 'expense', width: 15 },
      { header: 'Profit', key: 'profit', width: 15 }
    ];

    Object.entries(summaryMap).forEach(([date, values]) => {
      worksheet.addRow({
        date,
        earning: values.earnings,
        expense: values.expenses,
        profit: values.earnings - values.expenses
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=summary_weekly.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Weekly summary error:', error);
    res.status(500).send('Failed to export weekly summary');
  }
});

router.get('/:month/:year', async (req, res) => {
  const { month, year } = req.params;
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const earnings = await Earnings.find({ date: { $gte: startDate, $lt: endDate } });
    const expenses = await Expenses.find({ date: { $gte: startDate, $lt: endDate } });

    const summaryMap = {};
    earnings.forEach(e => {
      const date = formatDate(e.date);
      if (!summaryMap[date]) summaryMap[date] = { earnings: 0, expenses: 0 };
      summaryMap[date].earnings += (e.uber || 0) + (e.ola || 0) + (e.rapido || 0);
    });
    expenses.forEach(ex => {
      const date = formatDate(ex.date);
      if (!summaryMap[date]) summaryMap[date] = { earnings: 0, expenses: 0 };
      summaryMap[date].expenses += ex.amount || 0;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Summary_${month}_${year}`);
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Total Earning', key: 'earning', width: 15 },
      { header: 'Total Expenses', key: 'expense', width: 15 },
      { header: 'Profit', key: 'profit', width: 15 }
    ];

    Object.entries(summaryMap).forEach(([date, values]) => {
      worksheet.addRow({
        date,
        earning: values.earnings,
        expense: values.expenses,
        profit: values.earnings - values.expenses
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=summary_${month}_${year}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Monthly summary error:', error);
    res.status(500).send('Failed to export monthly summary');
  }
});

router.get('/:year', async (req, res) => {
  const { year } = req.params;

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${parseInt(year) + 1}-01-01`);

  try {
    const earnings = await Earnings.find({ date: { $gte: startDate, $lt: endDate } });
    const expenses = await Expenses.find({ date: { $gte: startDate, $lt: endDate } });

    const summaryMap = {};
    earnings.forEach(e => {
      const month = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, '0')}`;
      if (!summaryMap[month]) summaryMap[month] = { earnings: 0, expenses: 0 };
      summaryMap[month].earnings += (e.uber || 0) + (e.ola || 0) + (e.rapido || 0);
    });
    expenses.forEach(ex => {
      const month = `${ex.date.getFullYear()}-${String(ex.date.getMonth() + 1).padStart(2, '0')}`;
      if (!summaryMap[month]) summaryMap[month] = { earnings: 0, expenses: 0 };
      summaryMap[month].expenses += ex.amount || 0;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Yearly_Summary_${year}`);
    worksheet.columns = [
      { header: 'Month', key: 'month', width: 15 },
      { header: 'Total Earning', key: 'earning', width: 15 },
      { header: 'Total Expenses', key: 'expense', width: 15 },
      { header: 'Profit', key: 'profit', width: 15 }
    ];

    Object.entries(summaryMap).forEach(([month, values]) => {
      worksheet.addRow({
        month,
        earning: values.earnings,
        expense: values.expenses,
        profit: values.earnings - values.expenses
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=summary_yearly_${year}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Yearly summary error:', error);
    res.status(500).send('Failed to export yearly summary');
  }
});

module.exports = router;
