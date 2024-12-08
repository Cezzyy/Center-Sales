import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    reports: useStorage('reports', []),
    showAddReportModal: false,
    currentPage: 1,
    itemsPerPage: 10,
    sortColumn: 'date',
    sortDirection: 'desc',
    searchQuery: '',
    dateFilter: {
      start: '',
      end: '',
    },
  }),

  getters: {
    filteredReports: (state) => {
      let filtered = [...state.reports]

      // Apply search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (report) =>
            report.reportId.toLowerCase().includes(query) ||
            report.orderId.toLowerCase().includes(query) ||
            report.customerName.toLowerCase().includes(query),
        )
      }

      // Apply date filter
      if (state.dateFilter.start && state.dateFilter.end) {
        filtered = filtered.filter((report) => {
          const reportDate = new Date(report.date)
          const start = new Date(state.dateFilter.start)
          const end = new Date(state.dateFilter.end)
          return reportDate >= start && reportDate <= end
        })
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const aValue = a[state.sortColumn]
        const bValue = b[state.sortColumn]

        if (typeof aValue === 'string') {
          return state.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return state.sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      })

      return filtered
    },

    paginatedReports: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage
      return this.filteredReports.slice(start, start + state.itemsPerPage)
    },

    totalPages: (state) => {
      return Math.ceil(this.filteredReports.length / state.itemsPerPage)
    },

    totalRevenue: (state) => {
      return state.reports.reduce((sum, report) => sum + report.amount, 0)
    },

    averageOrderValue: (state) => {
      return state.reports.length
        ? state.reports.reduce((sum, report) => sum + report.amount, 0) / state.reports.length
        : 0
    },
  },

  actions: {
    addReport(report) {
      const newReport = {
        ...report,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        paymentStatus: 'Unpaid',
      }
      this.reports.push(newReport)
      return newReport // Return the created report
    },

    updateReport(reportId, updates) {
      const index = this.reports.findIndex((r) => r.reportId === reportId)
      if (index !== -1) {
        this.reports[index] = { ...this.reports[index], ...updates }
      }
    },

    deleteReport(reportId) {
      this.reports = this.reports.filter((r) => r.reportId !== reportId)
    },

    handleSort(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'asc'
      }
    },

    handlePageChange(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },

    setDateFilter(start, end) {
      this.dateFilter.start = start
      this.dateFilter.end = end
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },
  },
})
