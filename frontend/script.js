// =====================
// CONFIG
// =====================
const API_URL = "https://crm-backend-tuql.onrender.com/api";

// =====================
// AUTH
// =====================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "/index.html";
}

// =====================
// API HELPER
// =====================
async function apiFetch(endpoint, options = {}) {
  showLoader(true);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;

  } catch (err) {
    showToast(err.message, "error");
  } finally {
    showLoader(false);
  }
}

// =====================
// LOADER
// =====================
function showLoader(show) {
  let loader = document.getElementById("loader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader";
    loader.innerText = "Loading...";
    Object.assign(loader.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      zIndex: 9999
    });
    document.body.appendChild(loader);
  }

  loader.style.display = show ? "flex" : "none";
}

// =====================
// TOAST
// =====================
function showToast(msg, type = "success") {
  const toast = document.createElement("div");
  toast.innerText = msg;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px",
    borderRadius: "8px",
    color: "#fff",
    background: type === "error" ? "#ef4444" : "#22c55e"
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// =====================
// ROLE UI
// =====================
function applyRoleUI() {
  document.querySelector(".profile").innerText = user?.role || "User";

  if (user.role !== "admin") {
    document.querySelector('[onclick="showSection(\'users\')"]').style.display = "none";
  }
}

// =====================
// NAVIGATION
// =====================
function showSection(section) {
  ["dashboard", "users", "loans"].forEach(s => {
    document.getElementById(s + "Section").style.display = "none";
  });

  document.getElementById(section + "Section").style.display = "block";
}

// =====================
// EMI
// =====================
function calculateEMI(amount, interest, tenure) {
  const r = interest / 12 / 100;
  return Math.round((amount * r * Math.pow(1 + r, tenure)) /
    (Math.pow(1 + r, tenure) - 1));
}

// =====================
// DASHBOARD
// =====================
async function loadStats() {
  const data = await apiFetch("/dashboard");
  if (!data) return;

  totalUsers.innerText = data.totalUsers;
  totalLoans.innerText = data.totalLoans;
  approvedLoans.innerText = data.approvedLoans;
  pendingLoans.innerText = data.pendingLoans;
  rejectedLoans.innerText = data.rejectedLoans;
}

// =====================
// USERS
// =====================
async function loadUsers() {
  const users = await apiFetch("/users");
  if (!users) return;

  usersTable.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><button onclick="deleteUser('${u._id}')">Delete</button></td>
    </tr>
  `).join("");
}

async function deleteUser(id) {
  await apiFetch(`/users/${id}`, { method: "DELETE" });
  showToast("User deleted");
  loadUsers();
}

// =====================
// LOANS
// =====================
let allLoans = [];

async function loadLoans() {
  const loans = await apiFetch("/loans");
  if (!loans) return;

  allLoans = loans;
  displayLoans(loans);
}

function displayLoans(loans) {
  loansTable.innerHTML = loans.map(l => `
    <tr>
      <td>${l._id.slice(-6)}</td>
      <td>${l.userId?.name || "-"}</td>
      <td>${l.userId?.email || "-"}</td>
      <td>₹ ${l.amount.toLocaleString()}</td>
      <td>₹ ${calculateEMI(l.amount, l.interest, l.tenure)}</td>
      <td><span class="badge ${l.status}">${l.status}</span></td>
      <td>
        <button onclick="updateStatus('${l._id}','approved')">✔</button>
        <button onclick="updateStatus('${l._id}','rejected')">✖</button>
        <button onclick="deleteLoan('${l._id}')">🗑</button>
      </td>
    </tr>
  `).join("");
}

async function updateStatus(id, status) {
  await apiFetch(`/loans/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });
  showToast("Updated");
  loadLoans();
  loadStats();
}

async function deleteLoan(id) {
  await apiFetch(`/loans/${id}`, { method: "DELETE" });
  showToast("Deleted");
  loadLoans();
}

// =====================
// SEARCH
// =====================
function searchLoans(value) {
  const filtered = allLoans.filter(l =>
    l.userId?.name?.toLowerCase().includes(value.toLowerCase()) ||
    l._id.includes(value)
  );
  displayLoans(filtered);
}

// =====================
// CHART
// =====================
let chart;

async function loadChart() {
  const data = await apiFetch("/dashboard");
  if (!data) return;

  const ctx = document.getElementById("loanChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Approved", "Pending", "Rejected"],
      datasets: [{
        label: "Loans",
        data: [
          data.approvedLoans,
          data.pendingLoans,
          data.rejectedLoans
        ]
      }]
    }
  });
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
  loadStats();
  loadUsers();
  loadLoans();
  loadChart();
};