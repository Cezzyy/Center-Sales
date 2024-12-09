import { usePermissionsStore } from '@/stores/permissionsStore'

export function usePermissions() {
  const permissionsStore = usePermissionsStore()

  const can = {
    write: () => permissionsStore.hasPermission('write'),
    delete: () => permissionsStore.hasPermission('delete'),
    manageUsers: () => permissionsStore.hasPermission('manage_users'),
    manageRoles: () => permissionsStore.hasPermission('manage_roles'),
    viewReports: () => permissionsStore.hasPermission('view_reports'),
    exportData: () => permissionsStore.hasPermission('export_data'),
    manageSettings: () => permissionsStore.hasPermission('manage_settings')
  }

  return {
    can
  }
}
