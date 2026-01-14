const express = require("express");
const router = express.Router();
const Earnings = require("../models/Earnings");
const Expenses = require("../models/Expense");

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

router.get("/:type", async (req, res) => {
  const { type } = req.params;
  let startDate = new Date();

  if (type === "weekly") startDate.setDate(startDate.getDate() - 7);
  if (type === "monthly") startDate.setMonth(startDate.getMonth() - 1);
  if (type === "yearly") startDate.setFullYear(startDate.getFullYear() - 1);

  try {
    const earnings = await Earnings.find({ date: { $gte: startDate } });
    const expenses = await Expenses.find({ date: { $gte: startDate } });

    const map = {};

    earnings.forEach(e => {
      const date = formatDate(e.date);
      if (!map[date]) map[date] = { uber: 0, ola: 0, rapido: 0, fuel: 0, maintenance: 0, da: 0 };

      map[date].uber += e.uber || 0;
      map[date].ola += e.ola || 0;
      map[date].rapido += e.rapido || 0;
    });

expenses.forEach(ex => {
  const date = formatDate(ex.date);
  if (!map[date]) {
    map[date] = {
      uber: 0,
      ola: 0,
      rapido: 0,
      fuel: 0,
      maintenance: 0,
      da: 0
    };
  }

  const type = ex.type.toLowerCase(); 

  if (type === "fuel") map[date].fuel += ex.amount;
  if (type === "maintenance") map[date].maintenance += ex.amount;
  if (type === "da") map[date].da += ex.amount;
});


    const result = Object.entries(map).map(([date, v]) => ({
      date,
      ...v
    }));

    res.json(result);
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
});

module.exports = router;
