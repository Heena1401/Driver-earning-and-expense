const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"add-earning-expenses.html"));
})
const earningsRoutes = require('./routes/earnings');
app.use('/api/earnings', earningsRoutes);

const expensesRoutes = require('./routes/expenses');
app.use('/api/expenses', expensesRoutes);

const holidayRoutes = require('./routes/holidays');
app.use('/api/holidays', holidayRoutes);

const summaryExportRoutes = require('./routes/summaryExport');
app.use('/api/export-summary', summaryExportRoutes);


app.use("/api/dashboard-summary", require("./routes/summaryDashboard"));

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

const exportRoutes = require('./routes/export');
app.use('/api/export', exportRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
