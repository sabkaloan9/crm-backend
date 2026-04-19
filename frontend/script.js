// =====================
// CONFIG
// =====================
const API = "https://crm-backend-9kb2.onrender.com";
console.log("🔥 NEW SCRIPT RUNNING");

// =====================
// AUTH
// =====================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

if (!token) {
  window.location.href = "/index.html";
}

// =====================
// SAFE SET TEXT
// =====================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// =====================
// ROLE UI (NO ERROR)
// =====================
function applyRoleUI() {
  setText("userName", user?.name || "User");
  setText("userRole", user?.role || "user");

  if (user?.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => {
      el.style.display = "none";
    });
  }
}

// =====================
// DASHBOARD
// =====================
async function loadDashboard() {
  try {
    const res = await fetch(`${API}/api/dashboard`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    setText("totalLoans", data.totalLoans || 0);
    setText("approvedCount", data.approvedLoans || 0);
    setText("pendingCount", data.pendingLoans || 0);
    setText("rejectedCount", data.rejectedLoans || 0);
    setText("totalUsers", data.totalUsers || 0);

    updateChart(data);

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

// =====================
// LOANS
// =====================
async function loadLoans() {
  try {
    const res = await fetch(`${API}/api/loans`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const loans = await res.json();
    renderLoans(loans);

  } catch (err) {
    console.error(err);
  }
}

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
          <button class="action approve" onclick="updateStatus('${l._id}','approved')">✔</button>
          <button class="action reject" onclick="updateStatus('${l._id}','rejected')">✖</button>
        </td>
      </tr>
    `;
  });
}

// =====================
// ACTIONS
// =====================
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

// =====================
// CHART
// =====================
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
          data.approvedLoans || 0,
          data.pendingLoans || 0,
          data.rejectedLoans || 0
        ]
      }]
    }
  });
}

// =====================
// REALTIME SOCKET
// =====================
try {
  const socket = io(API, { transports: ["websocket"] });

  socket.on("loanUpdated", () => {
    loadDashboard();
    loadLoans();
  });
} catch (err) {
  console.log("Socket not connected");
}

// =====================
// LOGOUT
// =====================
function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

// =====================
// INIT
// =====================
window.onload = () => {
  applyRoleUI();
  loadDashboard();
  loadLoans();
};