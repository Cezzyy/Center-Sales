<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { useOrderInvoiceStore } from '@/stores/salesStore'
import { useClientStore } from '@/stores/clientStore'
import { storeToRefs } from 'pinia'

// Initialize stores
const salesStore = useOrderInvoiceStore()
const clientStore = useClientStore()

// Get reactive store data
const { orders, invoices } = storeToRefs(salesStore)
const { clients } = storeToRefs(clientStore)

// Chart refs
const salesChart = ref(null)
const clientDistributionChart = ref(null)
const salesRegionChart = ref(null)
const clientAcquisitionChart = ref(null)

// Format currency in PHP
const formatPHP = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount)
}

// Computed metrics
const totalSales = computed(() => {
  return orders.value?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0
})

const totalClients = computed(() => clients.value?.length || 0)

const overduePendingAmount = computed(() => {
  return invoices.value?.filter(invoice => !invoice.isPaid && invoice.daysOverdue > 0)
    .reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0
})

const recentOrders = computed(() => {
  if (!orders.value?.length) return []
  return [...orders.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
})

const hasOrders = computed(() => orders.value?.length > 0)

// Function to initialize Sales by Representative Chart
const createSalesRepChart = () => {
  const canvas = document.getElementById('salesRepChart')
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (salesRegionChart.value) {
    salesRegionChart.value.destroy()
  }
  
  const salesByRep = {}
  orders.value?.forEach(order => {
    const rep = order.salesRepresentative || 'Unassigned'
    salesByRep[rep] = (salesByRep[rep] || 0) + (order.amount || 0)
  })

  const colors = [
    'rgba(79, 70, 229, 0.6)',   // Indigo
    'rgba(16, 185, 129, 0.6)',  // Emerald
    'rgba(245, 158, 11, 0.6)',  // Amber
    'rgba(239, 68, 68, 0.6)',   // Red
    'rgba(59, 130, 246, 0.6)'   // Blue
  ]

  salesRegionChart.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(salesByRep),
      datasets: [{
        label: 'Sales by Representative',
        data: Object.values(salesByRep),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.6', '1')),
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { 
          display: true, 
          text: 'Sales Performance by Representative',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `Sales: ${formatPHP(context.raw)}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatPHP(value)
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

// Function to initialize Client Distribution Chart
const createClientDistributionChart = () => {
  const canvas = document.getElementById('clientDistributionChart')
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (clientDistributionChart.value) {
    clientDistributionChart.value.destroy()
  }

  const clientsByCompany = {}
  clients.value?.forEach(client => {
    const company = client.company || 'Individual'
    clientsByCompany[company] = (clientsByCompany[company] || 0) + 1
  })

  const colors = [
    'rgba(79, 70, 229, 0.8)',   // Indigo
    'rgba(16, 185, 129, 0.8)',  // Emerald
    'rgba(245, 158, 11, 0.8)',  // Amber
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(59, 130, 246, 0.8)'   // Blue
  ]

  clientDistributionChart.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(clientsByCompany),
      datasets: [{
        data: Object.values(clientsByCompany),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'right',
          labels: {
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        title: { 
          display: true, 
          text: 'Client Distribution',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        }
      }
    }
  })
}

// Function to initialize Monthly Sales Chart
const createSalesChart = () => {
  const canvas = document.getElementById('salesChart')
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (salesChart.value) {
    salesChart.value.destroy()
  }

  const monthlySales = {}
  orders.value?.forEach(order => {
    const month = new Date(order.date).toLocaleString('default', { month: 'short' })
    monthlySales[month] = (monthlySales[month] || 0) + (order.amount || 0)
  })

  salesChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(monthlySales),
      datasets: [{
        label: 'Monthly Sales',
        data: Object.values(monthlySales),
        borderColor: 'rgba(79, 70, 229, 1)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { 
          display: true, 
          text: 'Monthly Sales Trend',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `Sales: ${formatPHP(context.raw)}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatPHP(value)
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

// Function to initialize Client Acquisition Chart
const createClientAcquisitionChart = () => {
  const canvas = document.getElementById('clientAcquisitionChart')
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (clientAcquisitionChart.value) {
    clientAcquisitionChart.value.destroy()
  }

  // Group clients by join date (month)
  const clientsByMonth = {}
  clients.value?.forEach(client => {
    const date = new Date(client.joinDate || new Date())
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' })
    clientsByMonth[monthYear] = (clientsByMonth[monthYear] || 0) + 1
  })

  // Sort months chronologically
  const sortedMonths = Object.keys(clientsByMonth).sort((a, b) => {
    return new Date(a) - new Date(b)
  })

  // Calculate cumulative totals
  let cumulative = 0
  const cumulativeData = sortedMonths.map(month => {
    cumulative += clientsByMonth[month]
    return cumulative
  })

  clientAcquisitionChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sortedMonths,
      datasets: [
        {
          label: 'New Clients',
          data: sortedMonths.map(month => clientsByMonth[month]),
          borderColor: 'rgba(16, 185, 129, 1)', // Emerald
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          yAxisID: 'y',
          order: 2
        },
        {
          label: 'Total Clients',
          data: cumulativeData,
          borderColor: 'rgba(79, 70, 229, 1)', // Indigo
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          yAxisID: 'y1',
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: 'Client Acquisition Trend',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'New Clients'
          },
          grid: {
            drawOnChartArea: false
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Total Clients'
          },
          grid: {
            drawOnChartArea: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

// Initialize charts after component is mounted
onMounted(() => {
  nextTick(() => {
    try {
      createSalesRepChart()
      createClientDistributionChart()
      createSalesChart()
      createClientAcquisitionChart()
    } catch (error) {
      console.error('Error initializing charts:', error)
    }
  })
})

// Watch for changes in orders and clients data
watch([orders, clients], () => {
  nextTick(() => {
    try {
      createSalesRepChart()
      createClientDistributionChart()
      createSalesChart()
      createClientAcquisitionChart()
    } catch (error) {
      console.error('Error updating charts:', error)
    }
  })
})
</script>

<template>
  <div class="dashboard">
    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Total Sales</h3>
        <p class="metric-value">{{ formatPHP(totalSales) }}</p>
      </div>
      <div class="metric-card">
        <h3>Total Clients</h3>
        <p class="metric-value">{{ totalClients }}</p>
      </div>
      <div class="metric-card">
        <h3>Overdue Amount</h3>
        <p class="metric-value overdue">{{ formatPHP(overduePendingAmount) }}</p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <div class="chart-card">
        <canvas id="salesChart"></canvas>
        <div v-if="!hasOrders" class="empty-state">
          <i class="fas fa-chart-line empty-icon"></i>
          <p>No sales data available</p>
        </div>
      </div>
      <div class="chart-card">
        <canvas id="salesRepChart"></canvas>
        <div v-if="!hasOrders" class="empty-state">
          <i class="fas fa-users empty-icon"></i>
          <p>No sales representative data available</p>
        </div>
      </div>
      <div class="chart-card">
        <canvas id="clientDistributionChart"></canvas>
        <div v-if="!totalClients" class="empty-state">
          <i class="fas fa-building empty-icon"></i>
          <p>No client distribution data available</p>
        </div>
      </div>
      <div class="chart-card">
        <canvas id="clientAcquisitionChart"></canvas>
        <div v-if="!totalClients" class="empty-state">
          <i class="fas fa-user-plus empty-icon"></i>
          <p>No client acquisition data available</p>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="recent-orders">
      <div class="recent-orders-header">
        <h3>Recent Orders</h3>
        <span class="order-count" v-if="recentOrders.length">
          Showing last {{ recentOrders.length }} orders
        </span>
      </div>
      <div class="table-container" v-if="recentOrders.length">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.orderId">
              <td>{{ order.orderId }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ order.productName }}</td>
              <td>{{ formatPHP(order.amount) }}</td>
              <td>
                <span :class="['status-badge', order.status]">
                  {{ order.status }}
                </span>
              </td>
              <td>{{ new Date(order.date).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state table-empty-state">
        <i class="fas fa-shopping-cart empty-icon"></i>
        <p>No orders available</p>
        <span class="empty-state-subtitle">New orders will appear here</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: clamp(1rem, 2vw, 2rem);
  background-color: #f8fafc;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
}

.metric-card {
  background: white;
  padding: clamp(1rem, 2vw, 1.5rem);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0; /* Prevents flex items from overflowing */
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-card h3 {
  color: #64748b;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-value {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-value.overdue {
  color: #dc2626;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
}

.chart-card {
  background: white;
  padding: clamp(1rem, 2vw, 1.5rem);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  height: clamp(300px, 40vh, 350px);
  position: relative;
  transition: transform 0.2s ease-in-out;
  min-width: 0; /* Prevents flex items from overflowing */
}

.chart-card:hover {
  transform: translateY(-2px);
}

.recent-orders {
  background: white;
  padding: clamp(1rem, 2vw, 1.5rem);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.recent-orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.order-count {
  color: #64748b;
  font-size: 0.875rem;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  padding: 1rem;
}

.table-empty-state {
  position: relative;
  transform: none;
  left: 0;
  top: 0;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 2rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0.5rem 0;
}

.empty-state-subtitle {
  color: #94a3b8;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.25rem;
}

.chart-card {
  position: relative;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -1rem;
  padding: 0 1rem;
}

table {
  width: 100%;
  min-width: 640px; /* Minimum width before horizontal scroll */
  border-collapse: collapse;
}

th {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  text-align: left;
  padding: clamp(0.75rem, 1.5vw, 1rem);
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

td {
  padding: clamp(0.75rem, 1.5vw, 1rem);
  border-top: 1px solid #e2e8f0;
  color: #334155;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  max-width: 200px; /* Maximum width for td content */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

tr:hover td {
  background-color: #f8fafc;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: clamp(0.65rem, 1.2vw, 0.75rem);
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.025em;
  display: inline-block;
  white-space: nowrap;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #b45309;
}

.status-badge.completed {
  background-color: #dcfce7;
  color: #166534;
}

/* Small Mobile Devices */
@media (max-width: 480px) {
  .dashboard {
    padding: 0.75rem;
  }

  .metric-card {
    padding: 0.75rem;
  }

  .chart-card {
    height: 250px;
  }

  .table-container {
    margin: 0 -0.75rem;
    padding: 0 0.75rem;
  }

  th, td {
    padding: 0.5rem;
  }

  .status-badge {
    padding: 0.25rem 0.5rem;
  }

  .recent-orders-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .empty-icon {
    font-size: 1.5rem;
  }

  .empty-state p {
    font-size: 0.8125rem;
  }
}

/* Medium Devices */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card {
    height: 300px;
  }
}

/* Large Devices */
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

/* Extra Large Devices */
@media (min-width: 1280px) {
  .dashboard {
    max-width: 1440px;
    margin: 0 auto;
  }

  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Print styles for better reports */
@media print {
  .dashboard {
    padding: 0;
    background-color: white;
  }

  .metric-card,
  .chart-card,
  .recent-orders {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }

  .chart-card {
    height: 400px;
  }
}
</style>
