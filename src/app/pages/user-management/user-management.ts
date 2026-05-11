import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  users: any[] = [];
  showForm = false;
  editMode = false;
  editId = 0;
  searchTerm = '';
  filterRole = '';
  showResetModal = false;
  resetUserId = 0;
  resetPassword = 'Password@123';

  formData = { name: '', email: '', password: '', role: 'employee' };
  roles = ['admin', 'hr', 'employee', 'accountant'];

  constructor(private userService: UserService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.userService.getAll().subscribe((res: any) => { this.users = res; this.cdr.detectChanges(); });
  }

  get filteredUsers() {
    let u = this.users;
    if (this.filterRole) u = u.filter(x => x.role === this.filterRole);
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      u = u.filter(x => x.name?.toLowerCase().includes(t) || x.email?.toLowerCase().includes(t));
    }
    return u;
  }

  openAdd() {
    this.formData = { name: '', email: '', password: '', role: 'employee' };
    this.editMode = false;
    this.showForm = true;
  }

  openEdit(user: any) {
    this.formData = { name: user.name, email: user.email, password: '', role: user.role };
    this.editId = user.id;
    this.editMode = true;
    this.showForm = true;
  }

  submit() {
    if (this.editMode) {
      this.userService.update(this.editId, this.formData).subscribe((res: any) => {
        this.toast.success(res.message); this.showForm = false; this.load();
      }, (err) => this.toast.error(err.error?.message || 'Error'));
    } else {
      this.userService.create(this.formData).subscribe((res: any) => {
        this.toast.success(res.message); this.showForm = false; this.load();
      }, (err) => this.toast.error(err.error?.message || 'Error'));
    }
  }

  deactivate(id: number) {
    this.toast.confirm('Deactivate this user?', () => {
      this.userService.deactivate(id).subscribe((res: any) => {
        this.toast.success(res.message); this.load();
      });
    });
  }

  showActivateModal = false;
  activateUserId = 0;
  activateRole = 'employee';

  activate(user: any) {
    this.activateUserId = user.id;
    this.activateRole = 'employee';
    this.showActivateModal = true;
  }

  confirmActivate() {
    this.userService.activate(this.activateUserId, this.activateRole).subscribe((res: any) => {
      this.toast.success(res.message); this.showActivateModal = false; this.load();
    });
  }

  openResetPassword(id: number) {
    this.resetUserId = id;
    this.resetPassword = 'Password@123';
    this.showResetModal = true;
  }

  resetPwd() {
    this.userService.resetPassword(this.resetUserId, this.resetPassword).subscribe((res: any) => {
      this.toast.success(res.message); this.showResetModal = false;
    });
  }

  deleteUser(id: number) {
    this.toast.confirm('Delete this user permanently?', () => {
      this.userService.delete(id).subscribe((res: any) => {
        this.toast.success(res.message); this.load();
      }, (err) => this.toast.error(err.error?.message || 'Error'));
    });
  }

  getRoleColor(role: string): string {
    const c: any = { admin: '#e53935', hr: '#7b1fa2', employee: '#1976d2', accountant: '#388e3c', inactive: '#999' };
    return c[role] || '#666';
  }
}
