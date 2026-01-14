# 🚗 Driver Earning App – Backend

A Node.js + Express + MongoDB backend application to track driver earnings, expenses, holidays, and generate weekly/monthly/yearly summaries with dashboard support and Excel export.

---

## ✨ Features

- Add daily earnings (Uber, Ola, Rapido)
- Add expenses (Fuel, Maintenance, DA)
- Log holidays
- Weekly / Monthly / Yearly summaries
- Dashboard summary API (JSON)
- Excel export for summaries
- MongoDB-based persistent storage

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- ExcelJS
- REST APIs

---

## 📂 Project Structure
backend/
├── models/
│ ├── Earnings.js
│ ├── Expense.js
│ └── Holiday.js
├── routes/
│ ├── earnings.js
│ ├── expenses.js
│ ├── holidays.js
│ ├── summaryDashboard.js
│ └── summaryExport.js
├── add-earning-expenses.html
├── dashboard.html
├── dashboard.css
├── dashboard.js
├── server.js
├── package.json
├── .env
└── .gitignore
