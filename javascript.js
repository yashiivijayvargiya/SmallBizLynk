document.getElementById("creditSlider").addEventListener("input", function () {
    document.getElementById("creditValue").innerText = this.value;
  });
  
  function toggleForm() {
    alert("Toggle between Login and Sign Up (functionality to be added)");
  }
  
  function authAction() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username && password) {
      document.getElementById("authForm").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
    } else {
      alert("Please enter username and password.");
    }
  }
  
  const ctx = document.getElementById("statsChart").getContext("2d");
  const statsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Profit",
        data: [200, 300, 250, 400, 350, 500, 450],
        backgroundColor: "#4a148c"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
  
  const spendingCtx = document.getElementById("spendingChart").getContext("2d");
  const spendingChart = new Chart(spendingCtx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [{
        label: "Spending",
        data: [1200, 900, 1400, 1100],
        borderColor: "#4a148c",
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
  