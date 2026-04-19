const API = "https://crm-backend-9kb2.onrender.com";
console.log("🔥 FINAL SCRIPT LOADED");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

if (!token) window.location.href = "/index.html";

// STATE
let currentPage = 1;
let totalPages = 1;
let currentLoans = [];

// SAFE TEXT
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// ROLE UI
function applyRoleUI() {
  setText("userName", user?.name || "User");
  setText("userRole", user?.role || "user");

  if (user?.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => {
      el.style.display = "none";
    });
  }
}

// DASHBOARD
async function loadDashboard() {
  const res = await fetch(`${API}/api/dashboard`, {
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();

  setText("totalLoans", data.totalLoans);
  setText("approvedCount", data.approvedLoans);
  setText("pendingCount", data.pendingLoans);
  setText("rejectedCount", data.rejectedLoans);
  setText("totalUsers", data.totalUsers);

  updateChart(data);
}

// LOANS
async function loadLoans() {
  const search = document.getElementById("searchInput")?.value || "";
  const status = document.getElementById("statusFilter")?.value || "";

  const res = await fetch(`${API}/api/loans?page=${currentPage}&limit=5`, {
    headers: { Authorization: "Bearer " + token }
  });

  const result = await res.json();

  currentLoans = result.data || [];
  totalPages = result.pages || 1;

  let filtered = currentLoans;

  if (search) {
    filtered = filtered.filter(l =>
      l.userId?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status) {
    filtered = filtered.filter(l => l.status === status);
  }

  renderLoans(filtered);

  setText("pageInfo", `Page ${currentPage} / ${totalPages}`);
}

// RENDER
function renderLoans(loans) {
  const table = document.getElementById("loanTable");
  if (!table) return;

  table.innerHTML = "";

  loans.forEach(l => {
    table.innerHTML += `
      <tr>
        <td>${l.userId?.name || "N/A"}</td>
        <td>₹${l.amount}</td>
        <td>${l.status}</td>
        <td>${new Date(l.createdAt).toLocaleDateString()}</td>
        <td class="admin-only">
          <button onclick="updateStatus('${l._id}','approved')">✔</button>
          <button onclick="updateStatus('${l._id}','rejected')">✖</button>
        </td>
      </tr>
    `;
  });
}

// CREATE
async function createLoan() {
  await fetch(`${API}/api/loans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      amount: 50000,
      interest: 12,
      tenure: 12
    })
  });
}

// UPDATE
async function updateStatus(id, status) {
  await fetch(`${API}/api/loans/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ status })
  });
}

// PAGINATION
function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    loadLoans();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadLoans();
  }
}

// SEARCH + FILTER EVENTS
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput")?.addEventListener("input", () => {
    currentPage = 1;
    loadLoans();
  });

  document.getElementById("statusFilter")?.addEventListener("change", () => {
    currentPage = 1;
    loadLoans();
  });
});

// EXPORT CSV
function exportCSV() {
  if (!currentLoans.length) return alert("No data");

  let csv = "User,Amount,Status,Date\n";

  currentLoans.forEach(l => {
    csv += `${l.userId?.name},${l.amount},${l.status},${new Date(l.createdAt).toLocaleDateString()}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "loans.csv";
  a.click();
}

// CHART
let chart;
function updateChart(data) {
  const ctx = document.getElementById("chart");
  if (!ctx) return;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Approved", "Pending", "Rejected"],
      datasets: [{
        data: [
          data.approvedLoans,
          data.pendingLoans,
          data.rejectedLoans
        ]
      }]
    }
  });
}

// SOCKET
try {
  const socket = io(API);

  socket.on("loanUpdated", () => {
    loadDashboard();
    loadLoans();
  });
} catch (err) {
  console.log("No socket");
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

// INIT
window.onload = () => {
  applyRoleUI();
  loadDashboard();
  loadLoans();
};