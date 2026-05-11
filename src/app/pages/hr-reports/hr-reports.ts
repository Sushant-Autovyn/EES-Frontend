import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { HrReportsService } from '../../services/hr-reports.service';

@Component({
  selector: 'app-hr-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './hr-reports.html',
  styleUrl: './hr-reports.css'
})
export class HrReports implements OnInit {
  summary: any = {};
  departments: any[] = [];
  attendanceTrend: any[] = [];
  leaveStats: any[] = [];
  recentJoinings: any[] = [];

  constructor(private hrReports: HrReportsService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.hrReports.getSummary().subscribe((res: any) => { this.summary = res; this.cdr.detectChanges(); });
    this.hrReports.getDepartments().subscribe((res: any) => { this.departments = res; this.cdr.detectChanges(); });
    this.hrReports.getAttendanceTrend().subscribe((res: any) => { this.attendanceTrend = res; this.cdr.detectChanges(); });
    this.hrReports.getLeaveStats().subscribe((res: any) => { this.leaveStats = res; this.cdr.detectChanges(); });
    this.hrReports.getRecentJoinings().subscribe((res: any) => { this.recentJoinings = res; this.cdr.detectChanges(); });
  }

  getMaxDeptCount(): number {
    return Math.max(...this.departments.map(d => d.count), 1);
  }

  getMaxAttendance(): number {
    return Math.max(...this.attendanceTrend.map(a => a.present), 1);
  }
}
