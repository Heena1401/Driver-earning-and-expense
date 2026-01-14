// routes/export.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const Earnings = require('../models/Earnings');

router.get('/:month/:year', async (req, res) => {
  const { month, year } = req.params;

  try {
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const earnings = await Earnings.find({
      date: { $gte: startDate, $lt: endDate }
    });

    if (earnings.length === 0) {
      return res.status(404).send('No data found for this month.');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Earnings Summary');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Uber', key: 'uber', width: 10 },
      { header: 'Ola', key: 'ola', width: 10 },
      { header: 'Rapido', key: 'rapido', width: 10 },
    ];

    earnings.forEach(entry => {
      worksheet.addRow({
        date: entry.date.toISOString().split('T')[0],
        uber: entry.uber,
        ola: entry.ola,
        rapido: entry.rapido,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=earnings_${month}_${year}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).send('Error generating Excel file.');
  }
});

module.exports = router;
