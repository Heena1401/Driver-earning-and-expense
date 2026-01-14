const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post("/", async (req, res) => {
  try {
    const { date, reason } = req.body;

    const existing = await Holiday.findOne({ date });

    if (existing) {
      existing.reason = reason;
      await existing.save();
      return res.json({ message: "Holiday updated successfully" });
    }
 
    const newHoliday = new Holiday({ date, reason });
    await newHoliday.save();

    res.json({ message: "Holiday saved successfully" });

  } catch (err) {
    console.error("Holiday error:", err);
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const holidays = await Holiday.find().sort({ date: -1 });
  res.json(holidays);
});

module.exports = router;
