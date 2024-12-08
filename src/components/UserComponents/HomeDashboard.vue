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
  if (!orders.value) return []
  return [...orders.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

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

// Initialize charts after component is mounted
onMounted(() => {
  nextTick(() => {
    try {
      createSalesRepChart()
      createClientDistributionChart()
      createSalesChart()
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
      </div>
      <div class="chart-card">
        <canvas id="salesRepChart"></canvas>
      </div>
      <div class="chart-card">
        <canvas id="clientDistributionChart"></canvas>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="recent-orders">
      <h3>Recent Orders</h3>
      <div class="table-container">
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
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-card h3 {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.metric-value.overdue {
  color: #dc2626;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  height: 350px;
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.chart-card:hover {
  transform: translateY(-2px);
}

.recent-orders {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.recent-orders h3 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  text-align: left;
  padding: 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.875rem;
}

tr:hover td {
  background-color: #f8fafc;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.025em;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #b45309;
}

.status-badge.completed {
  background-color: #dcfce7;
  color: #166534;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .metric-card, .chart-card {
    padding: 1rem;
  }

  .chart-card {
    height: 300px;
  }

  .metric-value {
    font-size: 1.5rem;
  }
}
</style>
