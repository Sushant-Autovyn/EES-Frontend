import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { Payroll } from '../../services/payroll';
import { ReimbursementService } from '../../services/reimbursement.service';

@Component({
  selector: 'app-financial-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './financial-reports.html',
  styleUrl: './financial-reports.css'
})
export class FinancialReports implements OnInit {
  summary: any = {};
  deptReport: any[] = [];
  reimbSummary: any = {};
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  constructor(
    private payrollService: Payroll,
    private reimbService: ReimbursementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.payrollService.getReportSummary(this.selectedMonth, this.selectedYear)
      .subscribe((res: any) => { this.summary = res; this.cdr.detectChanges(); });
    this.payrollService.getDepartmentReport(this.selectedMonth, this.selectedYear)
      .subscribe((res: any) => { this.deptReport = res; this.cdr.detectChanges(); });
    this.reimbService.getSummary()
      .subscribe((res: any) => { this.reimbSummary = res; this.cdr.detectChanges(); });
  }

  getMonthName(m: number): string {
    return ['January','February','March','April','May','June','July','August','September','October','November','December'][m - 1];
  }

  getMaxDeptSalary(): number {
    return Math.max(...this.deptReport.map((d: any) => parseFloat(d.total_net) || 0), 1);
  }
}
