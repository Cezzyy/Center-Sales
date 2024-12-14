import { defineStore } from 'pinia'
import { ReportService } from '@/services/reportService'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    reports: [],
    isLoading: false,
    error: null,
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
            report.reportId?.toLowerCase().includes(query) ||
            report.orderId?.toLowerCase().includes(query) ||
            report.customerName?.toLowerCase().includes(query),
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

    totalRevenue: (state) => {
      return state.reports.reduce((sum, report) => sum + (report.amount || 0), 0)
    },

    averageOrderValue: (state) => {
      return state.reports.length
        ? state.reports.reduce((sum, report) => sum + (report.amount || 0), 0) /
            state.reports.length
        : 0
    },
  },

  actions: {
    async fetchReports() {
      try {
        this.isLoading = true
        this.error = null
        const reports = await ReportService.getReports()
        this.reports = reports
      } catch (error) {
        this.error = error.message || 'Failed to fetch reports'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async addReport(reportData) {
      try {
        this.isLoading = true
        this.error = null

        // Check if report already exists in local state
        const existingReport = this.reports.find((r) => r.orderId === reportData.orderId)
        if (existingReport) {
          throw new Error('A report for this order already exists')
        }

        const newReport = await ReportService.addReport(reportData)
        this.reports.push(newReport)
        return newReport
      } catch (error) {
        this.error = error.message || 'Failed to add report'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateReport(reportId, updates) {
      try {
        this.isLoading = true
        this.error = null
        const updatedReport = await ReportService.updateReport(reportId, updates)
        const index = this.reports.findIndex((r) => r.reportId === reportId)
        if (index !== -1) {
          this.reports[index] = updatedReport
        }
        return updatedReport
      } catch (error) {
        this.error = error.message || 'Failed to update report'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteReport(reportId) {
      try {
        this.isLoading = true
        this.error = null
        await ReportService.deleteReport(reportId)
        this.reports = this.reports.filter((r) => r.reportId !== reportId)
      } catch (error) {
        this.error = error.message || 'Failed to delete report'
        throw error
      } finally {
        this.isLoading = false
      }
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
      if (page >= 1 && page <= Math.ceil(this.filteredReports.length / this.itemsPerPage)) {
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
