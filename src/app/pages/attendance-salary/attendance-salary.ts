import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { Payroll } from '../../services/payroll';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-attendance-salary',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './attendance-salary.html',
  styleUrl: './attendance-salary.css'
})
export class AttendanceSalary implements OnInit {
  summary: any[] = [];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  totalPresent = 0;
  totalLeaves = 0;
  totalOvertime = 0;

  constructor(
    private payrollService: Payroll,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadSummary(); }

  loadSummary() {
    this.payrollService.getAttendanceSummary(this.selectedMonth, this.selectedYear)
      .subscribe((res: any) => {
        this.summary = res;
        this.totalPresent = res.reduce((s: number, r: any) => s + (parseInt(r.present_days) || 0), 0);
        this.totalLeaves = res.reduce((s: number, r: any) => s + (parseInt(r.approved_leaves) || 0), 0);
        this.totalOvertime = res.reduce((s: number, r: any) => s + (parseFloat(r.overtime_hours) || 0), 0);
        this.cdr.detectChanges();
      });
  }

  getMonthName(m: number): string {
    return ['January','February','March','April','May','June','July','August','September','October','November','December'][m - 1];
  }

  generatePayroll(emp: any) {
    this.payrollService.generatePayroll({
      employee_id: emp.employee_id,
      month: this.selectedMonth,
      year: this.selectedYear
    }).subscribe({
      next: (res: any) => this.toast.success(`Payroll generated for ${emp.name}`),
      error: (err: any) => this.toast.error(err.error?.message || 'Failed to generate')
    });
  }

  getAttendancePercent(emp: any): number {
    const present = parseInt(emp.present_days) || 0;
    return Math.min((present / 22) * 100, 100);
  }
}
