import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import * as XLSX from 'xlsx';

export const useProductsStore = defineStore('products', {
  // State
  state: () => ({
    showAddProductModal: false,
    showEditProductModal: false,
    products: useStorage('products', [
      {
        id: 1,
        name: 'Wireless Headphones',
        sku: 'WH-001',
        category: 'Electronics',
        quantity: 45,
        price: 99.99,
        status: 'In Stock',
      },
      {
        id: 2,
        name: 'Smart Watch',
        sku: 'SW-002',
        category: 'Electronics',
        quantity: 0,
        price: 199.99,
        status: 'Out of Stock',
      },
    ]),
    searchQuery: '',
    selectedCategory: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortColumn: 'name',
    sortDirection: 'asc',
  }),

  // Getters
  getters: {
    categories(state) {
      return [...new Set(state.products.map(product => product.category))];
    },
    totalProducts(state) {
      return state.products.length;
    },
    inStockProducts(state) {
      return state.products.filter(product => product.quantity > 0).length;
    },
    outOfStockProducts(state) {
      return state.products.filter(product => product.quantity === 0).length;
    },
    filteredProducts(state) {
      let items = state.products;

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        items = items.filter(
          product =>
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query),
        );
      }

      if (state.selectedCategory) {
        items = items.filter(product => product.category === state.selectedCategory);
      }

      return items.sort((a, b) => {
        const aValue = a[state.sortColumn];
        const bValue = b[state.sortColumn];

        if (typeof aValue === 'string') {
          return state.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return state.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    },
    paginatedProducts(state) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      return this.filteredProducts.slice(start, start + state.itemsPerPage);
    },
    totalPages(state) {
      return Math.ceil(this.filteredProducts.length / state.itemsPerPage);
    },
    pageNumbers(state) {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        if (
          i === 1 ||
          i === this.totalPages ||
          (i >= state.currentPage - 1 && i <= state.currentPage + 1)
        ) {
          pages.push(i);
        } else if (i === state.currentPage - 2 || i === state.currentPage + 2) {
          pages.push('...');
        }
      }
      return pages;
    },
  },

  // Actions
  actions: {
    handleSort(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    },
    handlePageChange(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    addProduct(product) {
      this.products.push(product);
    },
    updateProduct(updatedProduct) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    },
    deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.products = this.products.filter(p => p.id !== productId);
      }
    },
    exportToExcel() {
      const data = this.filteredProducts.map(product => ({
        'Product Name': product.name,
        SKU: product.sku,
        Category: product.category,
        'Stock Quantity': product.quantity,
        Price: product.price,
        Status: product.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      const date = new Date().toISOString().split('T')[0];
      const fileName = `products-${date}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    },
  },
});
