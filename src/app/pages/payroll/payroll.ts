import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { Payroll } from '../../services/payroll';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css'
})
export class PayrollComponent implements OnInit {
  payroll: any[] = [];
  employees: any[] = [];
  userRole: string = '';
  showGenerate = false;

  generateData = {
    employee_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  constructor(
    private payrollService: Payroll,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
    }
    this.getPayroll();
    this.loadEmployees();
  }

  getPayroll() {
    this.payrollService.getPayroll().subscribe((res: any) => {
      this.payroll = res;
      this.cdr.detectChanges();
    });
  }

  loadEmployees() {
    this.payrollService.getEmployeesList().subscribe((res: any) => {
      this.employees = res;
      this.cdr.detectChanges();
    });
  }

  generatePayroll() {
    if (!this.generateData.employee_id) {
      this.toast.warning('Select an employee');
      return;
    }
    this.payrollService.generatePayroll(this.generateData).subscribe({
      next: (res: any) => {
        this.toast.success('Payroll generated successfully');
        this.getPayroll();
        this.showGenerate = false;
      },
      error: (err: any) => this.toast.error(err.error?.message || 'Generation failed')
    });
  }

  processPayment(id: number) {
    this.payrollService.processPayment(id).subscribe({
      next: () => {
        this.toast.success('Payment processed');
        this.getPayroll();
      },
      error: (err: any) => this.toast.error(err.error?.message || 'Payment failed')
    });
  }

  getMonthName(m: number): string {
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1];
  }

  exportCSV() {
    const headers = ['ID','Employee','Month','Year','Gross','Deductions','Net','Status'];
    const rows = this.payroll.map((p: any) =>
      [p.id, p.name, p.month, p.year, p.gross_salary, p.total_deductions, p.net_salary, p.payment_status].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payroll.csv';
    a.click();
  }
}