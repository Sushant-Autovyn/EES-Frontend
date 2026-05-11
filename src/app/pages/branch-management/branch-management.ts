import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { BranchService } from '../../services/branch.service';
import { Employee } from '../../services/employee';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './branch-management.html',
  styleUrl: './branch-management.css'
})
export class BranchManagement implements OnInit {
  branches: any[] = [];
  employees: any[] = [];
  showForm = false;
  editMode = false;
  editId = 0;
  selectedBranch: any = null;
  branchEmployees: any[] = [];
  showAssign = false;
  assignEmpId = 0;

  formData = { name: '', address: '', city: '', state: '', phone: '', manager_id: '', status: 'Active' };

  constructor(
    private branchService: BranchService,
    private employeeService: Employee,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); this.loadEmployees(); }

  load() { this.branchService.getAll().subscribe((res: any) => { this.branches = res; this.cdr.detectChanges(); }); }
  loadEmployees() { this.employeeService.getEmployees().subscribe((res: any) => { this.employees = res; this.cdr.detectChanges(); }); }

  openAdd() {
    this.formData = { name: '', address: '', city: '', state: '', phone: '', manager_id: '', status: 'Active' };
    this.editMode = false; this.showForm = true;
  }

  openEdit(b: any) {
    this.formData = { name: b.name, address: b.address || '', city: b.city || '', state: b.state || '', phone: b.phone || '', manager_id: b.manager_id || '', status: b.status };
    this.editId = b.id; this.editMode = true; this.showForm = true;
  }

  submit() {
    const data = { ...this.formData, manager_id: this.formData.manager_id || null };
    if (this.editMode) {
      this.branchService.update(this.editId, data).subscribe((res: any) => {
        this.toast.success(res.message); this.showForm = false; this.load();
      }, (err) => this.toast.error(err.error?.message || 'Error'));
    } else {
      this.branchService.create(data).subscribe((res: any) => {
        this.toast.success(res.message); this.showForm = false; this.load();
      }, (err) => this.toast.error(err.error?.message || 'Error'));
    }
  }

  deleteBranch(id: number) {
    this.toast.confirm('Delete this branch?', () => {
      this.branchService.delete(id).subscribe((res: any) => { this.toast.success(res.message); this.load(); });
    });
  }

  selectBranch(b: any) {
    this.selectedBranch = b;
    this.branchService.getEmployees(b.id).subscribe((res: any) => { this.branchEmployees = res; this.cdr.detectChanges(); });
  }

  assignEmployee() {
    if (!this.assignEmpId || !this.selectedBranch) return;
    this.branchService.assignEmployee(this.assignEmpId, this.selectedBranch.id).subscribe((res: any) => {
      this.toast.success(res.message); this.showAssign = false; this.selectBranch(this.selectedBranch);
    });
  }

  getManagerName(id: number): string {
    const emp = this.employees.find(e => e.id === id);
    return emp ? emp.name : 'Not Assigned';
  }
}
