import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { AdminReportsService } from '../../services/admin-reports.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReports implements OnInit {
  summary: any = {};
  employeeReport: any = {};
  payrollReport: any = {};
  departmentReport: any[] = [];
  leaveReport: any[] = [];
  attendanceReport: any[] = [];
  activeTab = 'overview';

  constructor(private reports: AdminReportsService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.reports.getSummary().subscribe((res: any) => { this.summary = res; this.cdr.detectChanges(); });
    this.reports.getEmployeeReport().subscribe((res: any) => { this.employeeReport = res; this.cdr.detectChanges(); });
    this.reports.getPayrollReport().subscribe((res: any) => { this.payrollReport = res; this.cdr.detectChanges(); });
    this.reports.getDepartmentReport().subscribe((res: any) => { this.departmentReport = res; this.cdr.detectChanges(); });
    this.reports.getLeaveReport().subscribe((res: any) => { this.leaveReport = res; this.cdr.detectChanges(); });
    this.reports.getAttendanceReport().subscribe((res: any) => { this.attendanceReport = res; this.cdr.detectChanges(); });
  }

  getMaxDept(): number { return Math.max(...this.departmentReport.map(d => d.employee_count), 1); }
}
