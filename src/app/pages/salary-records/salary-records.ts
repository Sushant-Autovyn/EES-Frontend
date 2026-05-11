import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { Payroll } from '../../services/payroll';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-salary-records',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './salary-records.html',
  styleUrl: './salary-records.css'
})
export class SalaryRecords implements OnInit {
  salaries: any[] = [];
  employees: any[] = [];
  showForm = false;

  formData: any = {
    employee_id: '',
    basic_salary: 0,
    hra: 0,
    da: 0,
    ta: 0,
    bonus: 0,
    pf_deduction: 0,
    tax_deduction: 0,
    insurance: 0,
    other_deductions: 0
  };

  constructor(
    private payrollService: Payroll,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadSalaries();
    this.loadEmployees();
  }

  loadSalaries() {
    this.payrollService.getSalaries().subscribe((res: any) => {
      this.salaries = res;
      this.cdr.detectChanges();
    });
  }

  loadEmployees() {
    this.payrollService.getEmployeesList().subscribe((res: any) => {
      this.employees = res;
      this.cdr.detectChanges();
    });
  }

  getGross(s: any): number {
    return (parseFloat(s.basic_salary)||0) + (parseFloat(s.hra)||0) + (parseFloat(s.da)||0) + (parseFloat(s.ta)||0) + (parseFloat(s.bonus)||0);
  }

  getDeductions(s: any): number {
    return (parseFloat(s.pf_deduction)||0) + (parseFloat(s.tax_deduction)||0) + (parseFloat(s.insurance)||0) + (parseFloat(s.other_deductions)||0);
  }

  getNet(s: any): number {
    return this.getGross(s) - this.getDeductions(s);
  }

  editSalary(s: any) {
    this.formData = {
      employee_id: s.employee_id,
      basic_salary: s.basic_salary,
      hra: s.hra,
      da: s.da,
      ta: s.ta,
      bonus: s.bonus,
      pf_deduction: s.pf_deduction,
      tax_deduction: s.tax_deduction,
      insurance: s.insurance,
      other_deductions: s.other_deductions
    };
    this.showForm = true;
  }

  saveSalary() {
    if (!this.formData.employee_id) {
      this.toast.warning('Select an employee');
      return;
    }
    this.payrollService.saveSalary(this.formData).subscribe({
      next: () => {
        this.toast.success('Salary structure saved');
        this.loadSalaries();
        this.showForm = false;
        this.resetForm();
      },
      error: (err: any) => this.toast.error(err.error?.message || 'Save failed')
    });
  }

  resetForm() {
    this.formData = {
      employee_id: '',
      basic_salary: 0, hra: 0, da: 0, ta: 0, bonus: 0,
      pf_deduction: 0, tax_deduction: 0, insurance: 0, other_deductions: 0
    };
  }
}
