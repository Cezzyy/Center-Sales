<template>
  <div class="dashboard-container">
    <div class="chart-container">
      <canvas ref="salesRegionChart"></canvas>
    </div>

    <div class="chart-container">
      <canvas ref="clientDistributionChart"></canvas>
    </div>

    <div class="chart-container">
      <canvas ref="salesChart"></canvas>
    </div>

    <div class="chart-container">
      <canvas ref="clientGrowthChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const salesChart = ref(null)
const clientDistributionChart = ref(null)
const clientGrowthChart = ref(null)
const salesRegionChart = ref(null)

// Function to initialize Sales by Region Bar Chart
const createSalesRegionChart = () => {
  salesRegionChart.value = new Chart(salesRegionChart.value, {
    type: 'bar',
    data: {
      labels: ['North', 'South', 'East', 'West'],
      datasets: [
        {
          label: 'Sales by Region',
          data: [5000, 10000, 7500, 8000],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  })
}

// Function to initialize Client Distribution Bar Chart
const createClientDistributionChart = () => {
  clientDistributionChart.value = new Chart(clientDistributionChart.value, {
    type: 'bar',
    data: {
      labels: ['Corporate', 'Individual', 'Non-Profit'],
      datasets: [
        {
          label: 'Client Distribution',
          data: [300, 50, 100],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  })
}

// Function to initialize Monthly Sales Line Chart
const createSalesChart = () => {
  salesChart.value = new Chart(salesChart.value, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Monthly Sales',
          data: [12000, 19000, 3000, 5000, 2000],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  })
}

// Function to initialize Client Growth Line Chart
const createClientGrowthChart = () => {
  clientGrowthChart.value = new Chart(clientGrowthChart.value, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Client Growth',
          data: [50, 80, 120, 150, 200],
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  })
}

onMounted(() => {
  createSalesRegionChart()
  createClientDistributionChart()
  createSalesChart()
  createClientGrowthChart()
})
</script>

<style scoped>
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  gap: 30px;
  padding: 40px;
  background-color: #f8fafc;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
}

@media (max-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 20px;
    padding: 20px;
  }

  .chart-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }

  .chart-container {
    padding: 10px;
    height: 250px; /* Further reduce height for mobile */
  }
}
</style>
