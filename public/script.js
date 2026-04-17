// =====================
// AUTH CHECK
// =====================
const token = localStorage.getItem("token");
if (!token) window.location.href = "/index.html";

// =====================
// GLOBALS
// =====================
const API_URL = "http://localhost:5000/api";
let allLoans = [];
let currentUser = JSON.parse(localStorage.getItem("user") || "{}");
let chart;

// =====================
// LOADER + TOAST
// =====================
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function showToast(msg, type = "success") {
  const t = document.createElement("div");
  t.innerText = msg;
  Object.assign(t.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "12px",
    borderRadius: "8px",
    color: "#fff",
    background: type === "error" ? "#ef4444" : "#22c55e"
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// =====================
// API
// =====================
async function apiFetch(endpoint, options = {}) {
  try {
    showLoader();

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    if (res.status === 401) {
      localStorage.clear();
      location.href = "/index.html";
      return;
    }

    const data = await res.json();
    hideLoader();
    return data;

  } catch (err) {
    hideLoader();
    showToast("Server error", "error");
  }
}

// =====================
// NAVIGATION
// =====================
function showSection(s) {
  ["dashboard", "users", "loans"].forEach(x => {
    document.getElementById(x + "Section").style.display = "none";
  });
  document.getElementById(s + "Section").style.display = "block";
}

// =====================
// USERS
// =====================
async function loadUsers() {
  const users = await apiFetch("/users");

  let html = "";
  users.forEach(u => {
    html += `<tr><td>${u.name}</td><td>${u.email}</td></tr>`;
  });

  document.getElementById("usersTable").innerHTML = html;
}

// =====================
// LOANS
// =====================
async function loadLoans() {
  const loans = await apiFetch("/loans");

  allLoans = loans;
  displayLoans(loans);
  loadChart();

  showToast("Loans loaded");
}

function displayLoans(loans) {
  let html = "";

  loans.forEach(l => {
    const isAdmin = currentUser.role === "admin";

    html += `
      <tr>
        <td>${l.userId?.name || ""}</td>
        <td>${l.userId?.email || ""}</td>
        <td>${l.amount}</td>
        <td>${l.status}</td>
        <td>
          ${isAdmin ? `
            <button onclick="updateStatus('${l._id}','approved')">✔</button>
            <button onclick="updateStatus('${l._id}','rejected')">✖</button>
          ` : "View"}
        </td>
      </tr>
    `;
  });

  document.getElementById("loansTable").innerHTML = html;
}

// =====================
// FILTER
// =====================
function filterLoans() {
  const s = document.getElementById("searchInput").value.toLowerCase();
  const f = document.getElementById("statusFilter").value;

  let data = allLoans;

  if (s) {
    data = data.filter(l =>
      (l.userId?.name || "").toLowerCase().includes(s) ||
      (l.userId?.email || "").toLowerCase().includes(s)
    );
  }

  if (f) {
    data = data.filter(l => l.status === f);
  }

  displayLoans(data);
}

// =====================
// CRUD
// =====================
async function updateStatus(id, status) {
  await apiFetch(`/loans/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });

  loadLoans();
  showToast("Updated");
}

async function submitLoan() {
  const amount = document.getElementById("loanAmount").value;
  const interest = document.getElementById("loanInterest").value;
  const tenure = document.getElementById("loanTenure").value;

  await apiFetch("/loans", {
    method: "POST",
    body: JSON.stringify({ amount, interest, tenure })
  });

  closeLoanModal();
  loadLoans();
  showToast("Loan created");
}

// =====================
// MODAL
// =====================
function openLoanModal() {
  document.getElementById("loanModal").style.display = "flex";
}
function closeLoanModal() {
  document.getElementById("loanModal").style.display = "none";
}

// =====================
// CHART
// =====================
function loadChart() {
  let a=0,p=0,r=0;

  allLoans.forEach(l=>{
    if(l.status==="approved") a++;
    else if(l.status==="rejected") r++;
    else p++;
  });

  approvedCount.innerText=a;
  pendingCount.innerText=p;
  rejectedCount.innerText=r;

  const ctx = loanChart.getContext("2d");
  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:["Approved","Pending","Rejected"],
      datasets:[{label:"Loans",data:[a,p,r]}]
    }
  });
}

// =====================
// EXPORT
// =====================
function exportCSV() {
  let csv="Name,Email,Amount,Status\n";

  allLoans.forEach(l=>{
    csv+=`${l.userId?.name||""},${l.userId?.email||""},${l.amount},${l.status}\n`;
  });

  const blob=new Blob([csv]);
  const url=URL.createObjectURL(blob);

  const a=document.createElement("a");
  a.href=url;
  a.download="loans.csv";
  a.click();
}

// =====================
// LOGOUT
// =====================
function logout() {
  localStorage.clear();
  location.href="/index.html";
}

// =====================
// INIT
// =====================
window.onload = () => {
  if (currentUser.role !== "admin") {
    document.getElementById("addLoanBtn").style.display = "none";
  }

  loadUsers();
  loadLoans();
};