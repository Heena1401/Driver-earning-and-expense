const express = require('express');
const router = express.Router();
const Earnings = require('../models/Earnings'); 

router.post('/', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { uber, ola, rapido, date } = req.body;

    const earning = new Earnings({ uber, ola, rapido, date: new Date(date) });
    await earning.save();

    res.status(201).json({ message: 'Earning saved successfully' });
  } catch (error) {
    console.error('Error saving earnings:', error);
    res.status(500).json({ message: 'Error saving earnings' });
  }
});

module.exports = router;
