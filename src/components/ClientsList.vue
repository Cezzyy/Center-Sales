<template>
  <div class="clients-section">
    <div class="section-top">
      <h2 class="section-title">Clients List</h2>
      <button class="add-button">
        <span class="plus-icon">+</span>
        Add Client
      </button>
    </div>

    <div class="table-container">
      <table class="clients-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Company</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="profile-pic">
                <img src="/src/assets/tifa lockhart.jpg" alt="Profile Picture" />
              </div>
            </td>
            <td>Neil</td>
            <td>Vallecer</td>
            <td>123 Business Ave, Suite 100</td>
            <td>Tech Corp</td>
            <td>neil.vallecer@gmail.com</td>
            <td>+1 (555) 123-4567</td>
            <td class="actions">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.clients-section {
  width: 100%;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(to right, #ffffff, #f8fafc);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.section-title {
  font-size: 1.75rem;
  color: #1e293b;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.add-button {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.add-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
  padding: 1rem;
}

.clients-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1000px;
}

.clients-table th,
.clients-table td {
  padding: 1.25rem 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  font-size: 0.95rem;
}

.clients-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.clients-table tr {
  transition: all 0.2s ease;
}

.clients-table tbody tr:hover {
  background-color: rgba(249, 250, 251, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.profile-pic {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.profile-pic:hover {
  transform: scale(1.1);
  border-color: #4f46e5;
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
}

/* Custom scrollbar for webkit browsers */
.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .clients-section {
    border-radius: 0;
  }

  .section-top {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .table-container {
    margin: 0;
  }
}
</style>
