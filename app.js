// Authentication logic
let isLogin = true;

function toggleForm() {
  isLogin = !isLogin;
  const btn = document.querySelector('button');
  const toggleText = document.querySelector('.toggle');
  btn.innerText = isLogin ? 'Login' : 'Sign Up';
  toggleText.innerText = isLogin
    ? "Don't have an account? Sign Up"
    : 'Already have an account? Login';
}

function authAction() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if ((isLogin && username === 'admin' && password === 'admin123') || !isLogin) {
    document.getElementById('authForm').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
  } else {
    alert('Invalid credentials. Please try again.');
  }
}

// Credit slider update
const creditSlider = document.getElementById('creditSlider');
creditSlider.addEventListener('input', function () {
  document.getElementById('creditValue').innerText = this.value;
});

// Chart tab switching
let currentChart;
document.querySelectorAll('.tabs button').forEach((btn) => {
  btn.addEventListener('click', function () {
    document.querySelector('.tabs button.active').classList.remove('active');
    btn.classList.add('active');
    updateProfitChart(window.loadedData, btn.dataset.type);
  });
});

// Fetch and process JSON data
fetch("output.json")
  .then(res => res.json())
  .then(data => {
    window.loadedData = data;
    updateProfitChart(data, 'weekly');
    renderSpendingChart(data);
    renderTrendingProducts(data);
    renderTopProducts(data);
    renderPotentialForecast(data);
    renderCustomerOrders(data);
    renderIndustryComparison(data);
  });

// Functionality 1: Profit Statistics
function updateProfitChart(data, type) {
  const ctx = document.getElementById("statsChart").getContext("2d");
  if (currentChart) currentChart.destroy();

  let labels = [], profitValues = [];
  if (type === 'weekly') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    profitValues = [500, 800, 700, 1200, 900, 1100, 1300];
  } else {
    const map = new Map();
    data.forEach(entry => {
      const key = type === 'monthly' ? entry['Year-Month'] : entry['Year-Month'].slice(0, 4);
      map.set(key, (map.get(key) || 0) + entry.Profit);
    });
    labels = [...map.keys()].sort();
    profitValues = labels.map(label => map.get(label));
  }

  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Profit',
        data: profitValues,
        borderColor: '#7b1fa2',
        backgroundColor: 'rgba(123, 31, 162, 0.2)',
        borderWidth: 2
      }]
    }
  });
}

// Functionality 2: Monthly Spending (Pie Chart)
function renderSpendingChart(data) {
  const ctx = document.getElementById('spendingChart').getContext('2d');
  const monthMap = new Map();
  data.forEach(entry => {
    const ym = entry['Year-Month'];
    monthMap.set(ym, (monthMap.get(ym) || 0) + entry.Amount);
  });
  const months = [...monthMap.keys()].sort();
  const amounts = months.map(m => monthMap.get(m));
  const maxIndex = amounts.indexOf(Math.max(...amounts));
  const backgroundColors = amounts.map((_, i) => i === maxIndex ? '#ffb74d' : '#7b1fa2');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: months,
      datasets: [{
        data: amounts,
        backgroundColor: backgroundColors,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: item => `${item.label}: ₹${item.raw}`
          }
        }
      }
    }
  });

  document.querySelector('.spending h3').innerHTML = `Monthly Spending <strong>${months[maxIndex]}</strong> (₹${amounts[maxIndex]})`;
}

// Functionality 3: Season Trending Products
function renderTrendingProducts(data) {
  const trends = { Summer: {}, Winter: {} };
  data.forEach(entry => {
    const month = parseInt(entry['Year-Month'].split('-')[1]);
    const season = (month >= 4 && month <= 9) ? 'Summer' : 'Winter';
    const prod = entry['Sub-Category'];
    trends[season][prod] = (trends[season][prod] || 0) + entry.Quantity;
  });
  const container = document.querySelector(".season-trends ul");
  container.innerHTML = '';
  Object.entries(trends).forEach(([season, products]) => {
    const top = Object.entries(products).sort((a, b) => b[1] - a[1])[0];
    container.innerHTML += `<li>${season} - ${top[0]}</li>`;
  });
}

// Functionality 4: Highest Selling Products
function renderTopProducts(data) {
  const map = new Map();
  data.forEach(e => map.set(e['Sub-Category'], (map.get(e['Sub-Category']) || 0) + e.Quantity));
  const top = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  document.querySelector(".top-products ul").innerHTML = top.map(t => `<li>${t[0]}</li>`).join('');
}

// Functionality 5: Business Potential Forecast
function renderPotentialForecast(data) {
  const yearMap = new Map();
  data.forEach(e => {
    const year = e['Year-Month'].slice(0, 4);
    yearMap.set(year, (yearMap.get(year) || 0) + e.Profit);
  });
  const years = [...yearMap.keys()].sort();
  const last = yearMap.get(years[years.length - 1]);
  const prev = yearMap.get(years[years.length - 2]);
  const growth = prev ? (((last - prev) / prev) * 100).toFixed(1) : 0;
  document.querySelector(".business-potential p").innerHTML = `Expected growth next quarter: <strong>${growth}%</strong>`;
}

// Functionality 6: Customer Orders
function renderCustomerOrders(data) {
  const customerSet = new Set();
  const orders = data.filter(entry => {
    if (!customerSet.has(entry['CustomerName'])) {
      customerSet.add(entry['CustomerName']);
      return true;
    }
    return false;
  });
  const list = document.getElementById("orderList");
  list.innerHTML = orders.slice(0, 5).map((o, i) => `<li>Order #00${i + 1} - Completed</li>`).join('');
}

// Functionality 7: Industry Comparison
function renderIndustryComparison(data) {
  const avg = 20000;
  const total = data.reduce((sum, e) => sum + e.Profit, 0);
  const comparison = ((total / (avg * data.length)) * 100).toFixed(0);
  document.querySelector(".business-comparison p").innerHTML = `Your business is performing <strong>${comparison}%</strong> better than the average in your niche.`;
}