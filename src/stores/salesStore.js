import { defineStore } from 'pinia';
// import { computed } from 'vue';

// Utility function for the filter getter problem
// const createFilterMatcher = (filterValue, field) => {
//   if (!filterValue) return () => true;
//   const lowercaseFilter = filterValue.toLowerCase();
//   return (item) => item[field].toLowerCase().includes(lowercaseFilter);
// };

export const useOrderInvoiceStore = defineStore('orderInvoice', {
  // State
  state: () => ({
    // Modals
    isAddSalesModalOpen: false,
    isAddInvoiceModalOpen: false,
    isViewOrderModalOpen: false,
    isEditOrderModalOpen: false,
    isEditInvoiceModalOpen: false,

    // Data for modals
    viewOrder: {
      orderId: '',
      customerName: '',
      productName: '',
      quantity: 0,
      salesRepresentative: '',
      amount: 0,
      status: '',
    },
    editOrder: {
      orderId: '',
      customerName: '',
      productName: '',
      quantity: 0,
      salesRepresentative: '',
      amount: 0,
      status: '',
    },
    editInvoice: {
      invoiceId: '',
      customerName: '',
      amount: 0,
      dueDate: '',
    },

    // Orders and Invoices
    orders: [
      {
        orderId: 'ORD-001',
        customerName: 'John Doe',
        productName: 'Product A',
        amount: 1500,
        status: 'pending',
        quantity: 10,
        salesRepresentative: 'Neil Vallecer',
        date: '2024-01-01',
      },
      {
        orderId: 'ORD-002',
        customerName: 'Jane Smith',
        productName: 'Product B',
        amount: 1200,
        status: 'completed',
        quantity: 5,
        salesRepresentative: 'Neil Vallecer',
        date: '2024-01-02',
      },
    ],
    invoices: [
      {
        invoiceId: 'INV-001',
        customer: 'John Doe',
        amount: 1500,
        dueDate: '2024-02-01',
        daysOverdue: 15,
      },
      {
        invoiceId: 'INV-002',
        customer: 'Jane Smith',
        amount: 1200,
        dueDate: '2024-02-10',
        daysOverdue: 0,
      },
    ],

    // Pagination
    currentPageOrders: 1,
    currentPageInvoices: 1,
    itemsPerPage: 10,

    // Filters
    orderFilters: {
      dateFrom: '',
      dateTo: '',
      orderId: '',
      customerName: '',
      productName: '',
      status: '',
    },
    invoiceFilters: {
      invoiceId: '',
      customer: '',
    },
  }),

  // Getters
  getters: {
    filteredOrders(state) {
      return state.orders.filter(order => {
        const matchesOrderId =
          !state.orderFilters.orderId ||
          order.orderId.toLowerCase().includes(state.orderFilters.orderId.toLowerCase());

        const matchesCustomer =
          !state.orderFilters.customerName ||
          order.customerName.toLowerCase().includes(state.orderFilters.customerName.toLowerCase());

        const matchesProduct =
          !state.orderFilters.productName ||
          order.productName.toLowerCase().includes(state.orderFilters.productName.toLowerCase());

        const matchesStatus =
          !state.orderFilters.status || order.status === state.orderFilters.status;

        const matchesDateRange =
          (!state.orderFilters.dateFrom || !state.orderFilters.dateTo) ||
          (order.date >= state.orderFilters.dateFrom && order.date <= state.orderFilters.dateTo);

        return (
          matchesOrderId &&
          matchesCustomer &&
          matchesProduct &&
          matchesStatus &&
          matchesDateRange
        );
      });
    },
    //Solution for the filter getter problem part 2:
    // filteredOrders: computed(state => {
    //   // Create matchers only once per filter change
    //   const matchers = {
    //     orderId: createFilterMatcher(state.orderFilters.orderId, 'orderId'),
    //     customerName: createFilterMatcher(state.orderFilters.customerName, 'customerName'),
    //     productName: createFilterMatcher(state.orderFilters.productName, 'productName'),
    //     status: state.orderFilters.status
    //       ? (order) => order.status === state.orderFilters.status
    //       : () => true
    //   };

    //   // Date range matcher
    //   const dateRangeMatcher = (order) => {
    //     if (!state.orderFilters.dateFrom || !state.orderFilters.dateTo) return true;
    //     return order.date >= state.orderFilters.dateFrom &&
    //            order.date <= state.orderFilters.dateTo;
    //   };

    //   // Single pass filter
    //   return state.orders.filter(order =>
    //     matchers.orderId(order) &&
    //     matchers.customerName(order) &&
    //     matchers.productName(order) &&
    //     matchers.status(order) &&
    //     dateRangeMatcher(order)
    //   );
    // }),
    paginatedOrders(state) {
      const startIndex = (state.currentPageOrders - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return this.filteredOrders.slice(startIndex, endIndex);
    },
    totalOrderPages(state) {
      return Math.ceil(this.filteredOrders.length / state.itemsPerPage);
    },
    filteredInvoices(state) {
      return state.invoices.filter(invoice => {
        const matchesInvoiceId =
          !state.invoiceFilters.invoiceId ||
          invoice.invoiceId.toLowerCase().includes(state.invoiceFilters.invoiceId.toLowerCase());

        const matchesCustomer =
          !state.invoiceFilters.customer ||
          invoice.customer.toLowerCase().includes(state.invoiceFilters.customer.toLowerCase());

        return matchesInvoiceId && matchesCustomer;
      });
    },
    paginatedInvoices(state) {
      const startIndex = (state.currentPageInvoices - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return this.filteredInvoices.slice(startIndex, endIndex);
    },
    totalInvoicePages(state) {
      return Math.ceil(this.filteredInvoices.length / state.itemsPerPage);
    },
  },

  // Actions
  actions: {
    // Modal Handlers
    openModal(modalName) {
      this[`is${modalName}ModalOpen`] = true;
    },
    closeModal(modalName) {
      this[`is${modalName}ModalOpen`] = false;
    },

    // Handle submission from modals
    handleEditOrderSubmit(updatedOrder) {
      const index = this.orders.findIndex(order => order.orderId === updatedOrder.orderId);
      if (index !== -1) {
        this.orders[index] = { ...this.orders[index], ...updatedOrder };
      }
      this.closeModal('EditOrder');
    },

    handleEditInvoiceSubmit(updatedInvoice) {
      const index = this.invoices.findIndex(invoice => invoice.invoiceId === updatedInvoice.invoiceId);
      if (index !== -1) {
        this.invoices[index] = { ...this.invoices[index], ...updatedInvoice };
      }
      this.closeModal('EditInvoice');
    },

    handleAddInvoiceSubmit(updatedInvoice) {
      this.invoices.push(updatedInvoice);
      this.closeModal('AddInvoice');
    },

    handleAddSalesSubmit(salesData) {
      this.orders.push(salesData);
      this.closeModal('AddSales');
    },

    markInvoiceAsPaid(invoiceId) {
      const index = this.invoices.findIndex(invoice => invoice.invoiceId === invoiceId);
      if (index !== -1) {
        this.invoices[index] = { 
          ...this.invoices[index], 
          isPaid: true,
          paidDate: new Date().toISOString().split('T')[0]
        };
      }
    },

    // Pagination Handlers
    goToPage(pageType, page) {
      if (pageType === 'orders' && page >= 1 && page <= this.totalOrderPages) {
        this.currentPageOrders = page;
      } else if (pageType === 'invoices' && page >= 1 && page <= this.totalInvoicePages) {
        this.currentPageInvoices = page;
      }
    },
    goToPreviousPage(pageType) {
      if (pageType === 'orders' && this.currentPageOrders > 1) {
        this.currentPageOrders--;
      } else if (pageType === 'invoices' && this.currentPageInvoices > 1) {
        this.currentPageInvoices--;
      }
    },
    goToNextPage(pageType) {
      if (pageType === 'orders' && this.currentPageOrders < this.totalOrderPages) {
        this.currentPageOrders++;
      } else if (pageType === 'invoices' && this.currentPageInvoices < this.totalInvoicePages) {
        this.currentPageInvoices++;
      }
    },

    // Reset Filters
    resetFilters(filterType) {
      if (filterType === 'orders') {
        this.orderFilters = {
          dateFrom: '',
          dateTo: '',
          orderId: '',
          customerName: '',
          productName: '',
          status: '',
        };
      } else if (filterType === 'invoices') {
        this.invoiceFilters = {
          invoiceId: '',
          customer: '',
        };
      }
    },
  },
});
