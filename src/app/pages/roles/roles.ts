import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { ToastService } from '../../services/toast.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles implements OnInit {

  allUsers: any[] = [];
  allEmployees: any[] = [];
  roles: any[] = [];
  activeTab: string = 'users';

  editMode = false;
  editId: number | null = null;

  roleData = {
    role_name: '',
    description: '',
    permissions: '' as string,
    department_access: '',
    status: 'Active'
  };

  permissionOptions = ['dashboard', 'employees', 'attendance', 'leaves', 'payroll', 'roles', 'calendar', 'team-members', 'salary-records', 'payslip', 'attendance-salary', 'financial-reports', 'reimbursements', 'hr-onboarding', 'hr-recruitment', 'hr-documents', 'hr-reports', 'hr-departments', 'user-management', 'system-settings', 'announcements', 'audit-logs', 'backup-recovery', 'admin-reports', 'branch-management', 'my-documents'];
  selectedPermissions: string[] = [];

  private apiUrl = 'http://localhost:5000/api/roles';

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getRoles();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  getAllUsers() {
    this.http.get(`${this.apiUrl}/users/all`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (res: any) => {
        this.allUsers = res.users || [];
        this.allEmployees = res.employees || [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  getRoles() {
    this.http.get(this.apiUrl, {
      headers: this.getHeaders()
    }).subscribe({
      next: (res: any) => {
        this.roles = res;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  changeUserRole(userId: number, target: any) {
    const newRole = target.value;
    const user = this.allUsers.find(u => u.id === userId);
    if (user && user.role === newRole) return;

    this.http.put(`${this.apiUrl}/users/change-role/${userId}`, { role: newRole }, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.toast.success('Role updated successfully');
        this.getAllUsers();
      },
      error: (err) => {
        target.value = user?.role || 'employee';
        this.toast.error(err.error?.message || 'Failed to update role');
      }
    });
  }

  deleteUser(userId: number, userName: string) {
    this.toast.confirm(`This will permanently delete ${userName}. Continue?`, () => {
      this.http.delete(`${this.apiUrl}/users/${userId}`, {
        headers: this.getHeaders()
      }).subscribe({
        next: () => {
          this.toast.success(`${userName} deleted successfully`);
          this.getAllUsers();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to delete user')
      });
    });
  }

  getRoleBadgeClass(role: string): string {
    switch(role) {
      case 'admin': return 'badge-admin';
      case 'hr': return 'badge-hr';
      case 'accountant': return 'badge-accountant';
      default: return 'badge-employee';
    }
  }

  getUserCountByRole(role: string): number {
    return this.allUsers.filter(u => u.role === role).length;
  }

  togglePermission(perm: string) {
    const idx = this.selectedPermissions.indexOf(perm);
    if (idx > -1) {
      this.selectedPermissions.splice(idx, 1);
    } else {
      this.selectedPermissions.push(perm);
    }
    this.roleData.permissions = this.selectedPermissions.join(',');
  }

  addRole() {
    if (!this.roleData.role_name.trim()) {
      this.toast.warning('Role name is required');
      return;
    }

    this.roleData.permissions = this.selectedPermissions.join(',');
    const headers = this.getHeaders();

    if (this.editMode && this.editId) {
      this.http.put(`${this.apiUrl}/${this.editId}`, this.roleData, { headers })
        .subscribe({
          next: () => {
            this.toast.success('Role updated');
            this.resetForm();
            this.getRoles();
            this.roleService.notifyRolesUpdated();
          },
          error: (err) => this.toast.error(err.error?.message || 'Update failed')
        });
    } else {
      this.http.post(this.apiUrl, this.roleData, { headers })
        .subscribe({
          next: () => {
            this.toast.success('Role added');
            this.resetForm();
            this.getRoles();
            this.roleService.notifyRolesUpdated();
          },
          error: (err) => this.toast.error(err.error?.message || 'Add failed')
        });
    }
  }

  editRole(role: any) {
    this.activeTab = 'settings';
    this.editMode = true;
    this.editId = role.id;
    this.roleData = {
      role_name: role.role_name,
      description: role.description || '',
      permissions: role.permissions || '',
      department_access: role.department_access || '',
      status: role.status || 'Active'
    };
    this.selectedPermissions = role.permissions ? role.permissions.split(',') : [];
  }

  deleteRole(id: number) {
    this.toast.confirm('This will permanently delete this role. Continue?', () => {
      this.http.delete(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders()
      }).subscribe({
        next: () => {
          this.toast.success('Role deleted');
          this.getRoles();
        },
        error: (err) => this.toast.error(err.error?.message || 'Delete failed')
      });
    });
  }

  resetForm() {
    this.roleData = {
      role_name: '',
      description: '',
      permissions: '',
      department_access: '',
      status: 'Active'
    };
    this.selectedPermissions = [];
    this.editMode = false;
    this.editId = null;
  }
}
