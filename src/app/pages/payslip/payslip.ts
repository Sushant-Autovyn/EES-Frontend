import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { Payroll } from '../../services/payroll';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './payslip.html',
  styleUrl: './payslip.css'
})
export class PayslipComponent implements OnInit {
  payrollRecords: any[] = [];
  selectedPayslip: any = null;
  showPayslip = false;

  constructor(
    private payrollService: Payroll,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.payrollService.getPayroll().subscribe((res: any) => {
      this.payrollRecords = res.filter((r: any) => r.payment_status === 'Paid');
      this.cdr.detectChanges();
    });
  }

  viewPayslip(record: any) {
    this.payrollService.getPayslip(record.id).subscribe((res: any) => {
      this.selectedPayslip = res;
      this.showPayslip = true;
      this.cdr.detectChanges();
    });
  }

  closePayslip() {
    this.showPayslip = false;
    this.selectedPayslip = null;
  }

  getMonthName(m: number): string {
    return ['January','February','March','April','May','June','July','August','September','October','November','December'][m - 1];
  }

  downloadPDF() {
    const printContent = document.getElementById('payslip-print');
    if (!printContent) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Payslip</title>
      <style>
        body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
        .payslip-doc{max-width:700px;margin:0 auto;border:2px solid #e2e8f0;border-radius:12px;overflow:hidden}
        .payslip-header{background:#0f172a;color:#fff;padding:24px 30px;display:flex;justify-content:space-between;align-items:center}
        .company-name{font-size:22px;font-weight:700}
        .payslip-label{font-size:14px;color:#94a3b8}
        .emp-details{padding:20px 30px;display:grid;grid-template-columns:1fr 1fr;gap:10px;border-bottom:1px solid #e2e8f0}
        .detail-item{font-size:14px;color:#475569}
        .detail-item strong{color:#0f172a}
        .salary-table{width:100%;border-collapse:collapse}
        .salary-table th{background:#f1f5f9;padding:10px 16px;text-align:left;font-size:13px;color:#475569;text-transform:uppercase}
        .salary-table td{padding:10px 16px;border-bottom:1px solid #f1f5f9;font-size:14px}
        .salary-table .total-row{background:#f8fafc;font-weight:700}
        .net-row{background:#0f172a;color:#10b981;font-size:18px;font-weight:800}
        .net-row td{padding:16px;color:#10b981}
        @media print{body{padding:0}}
      </style></head><body>${printContent.innerHTML}</body></html>
    `);
    win.document.close();
    win.print();
  }
}
