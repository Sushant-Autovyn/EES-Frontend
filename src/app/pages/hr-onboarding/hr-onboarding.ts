import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { OnboardingService } from '../../services/onboarding.service';
import { Employee } from '../../services/employee';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-hr-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './hr-onboarding.html',
  styleUrl: './hr-onboarding.css'
})
export class HrOnboarding implements OnInit {
  tasks: any[] = [];
  employees: any[] = [];
  selectedEmployee: any = null;
  employeeTasks: any[] = [];
  showAddForm = false;
  newStep = '';
  selectedEmpId: number = 0;
  searchTerm = '';

  constructor(
    private onboardingService: OnboardingService,
    private employeeService: Employee,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadEmployees();
  }

  loadAll() {
    this.onboardingService.getAll().subscribe((res: any) => {
      this.tasks = res;
      this.cdr.detectChanges();
    });
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((res: any) => {
      this.employees = res;
      this.cdr.detectChanges();
    });
  }

  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
    this.selectedEmpId = emp.id;
    this.onboardingService.getByEmployee(emp.id).subscribe((res: any) => {
      this.employeeTasks = res;
      this.cdr.detectChanges();
    });
  }

  initOnboarding(empId: number) {
    this.onboardingService.initOnboarding(empId).subscribe((res: any) => {
      this.toast.success(res.message);
      this.selectEmployee(this.selectedEmployee);
      this.loadAll();
    });
  }

  completeStep(id: number) {
    this.onboardingService.completeStep(id).subscribe((res: any) => {
      this.toast.success(res.message);
      this.selectEmployee(this.selectedEmployee);
    });
  }

  addStep() {
    if (!this.newStep || !this.selectedEmpId) return;
    this.onboardingService.addStep({ employee_id: this.selectedEmpId, step: this.newStep }).subscribe((res: any) => {
      this.toast.success(res.message);
      this.newStep = '';
      this.showAddForm = false;
      this.selectEmployee(this.selectedEmployee);
    });
  }

  deleteStep(id: number) {
    this.onboardingService.deleteStep(id).subscribe((res: any) => {
      this.toast.success(res.message);
      this.selectEmployee(this.selectedEmployee);
    });
  }

  getProgress(): number {
    if (!this.employeeTasks.length) return 0;
    const completed = this.employeeTasks.filter(t => t.status === 'Completed').length;
    return Math.round((completed / this.employeeTasks.length) * 100);
  }

  get filteredEmployees() {
    if (!this.searchTerm) return this.employees;
    return this.employees.filter((e: any) =>
      e.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.department?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
