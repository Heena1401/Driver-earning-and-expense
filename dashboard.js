// Dummy Data (Replace with API call)
const data = {
  weekly: [
    { date: "2025-08-14", uber: 500, ola: 400, rapido: 300, fuel: 200, maintenance: 50, da: 100 },
    { date: "2025-08-15", uber: 600, ola: 450, rapido: 350, fuel: 250, maintenance: 60, da: 120 },
  ],
  monthly: [
    { date: "2025-08-01", uber: 2000, ola: 1500, rapido: 1000, fuel: 800, maintenance: 200, da: 400 },
  ],
  yearly: [
    { date: "2025-01-01", uber: 25000, ola: 20000, rapido: 15000, fuel: 8000, maintenance: 3000, da: 4000 },
  ]
};

let currentView = 'weekly';

async function showSummary(type) {
  currentView = type;

  document.getElementById('summary-title').innerText =
    `${type.charAt(0).toUpperCase() + type.slice(1)} Summary`;


  const res = await fetch(`http://localhost:5000/api/dashboard-summary/${type}`);
  const records = await res.json();

  let totalEarnings = 0, totalExpenses = 0;
  const tableBody = document.getElementById('records-table');
  tableBody.innerHTML = "";

  records.forEach(r => {
    const earnings = r.uber + r.ola + r.rapido;
    const expenses = r.fuel + r.maintenance + r.da;

    totalEarnings += earnings;
    totalExpenses += expenses;

    tableBody.innerHTML += `
      <tr>
        <td>${r.date}</td>
        <td>${r.uber}</td>
        <td>${r.ola}</td>
        <td>${r.rapido}</td>
        <td>${r.fuel}</td>
        <td>${r.maintenance}</td>
        <td>${r.da}</td>
        <td>${earnings - expenses}</td>
      </tr>
    `;
  });

  document.getElementById('total-earnings').innerText = `₹${totalEarnings}`;
  document.getElementById('total-expenses').innerText = `₹${totalExpenses}`;
  document.getElementById('net-profit').innerText = `₹${totalEarnings - totalExpenses}`;

  updateChart(totalEarnings, totalExpenses);
}
let chart;
function updateChart(earnings, expenses) {
  const ctx = document.getElementById('earningsChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Earnings', 'Expenses'],
      datasets: [{
        data: [earnings, expenses],
        backgroundColor: ['#4caf50', '#ef233c']
      }]
    }
  });
}

showSummary('weekly');
