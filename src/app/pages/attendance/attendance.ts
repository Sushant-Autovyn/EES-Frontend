import { Component, OnInit, ChangeDetectorRef }
from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import { Sidebar }
from '../../components/sidebar/sidebar';

import { Navbar }
from '../../components/navbar/navbar';

import { Attendance as AttendanceService }
from '../../services/attendance';

import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Navbar
  ],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})

export class Attendance
implements OnInit {

  attendanceList:any[] = [];
  reportList:any[] = [];
  showReport = false;
  reportMonth = new Date().getMonth() + 1;
  reportYear = new Date().getFullYear();
  userRole: string = '';

  attendanceData = {
    employee_id:'',
    status:'Present'
  };

  todayStatus: any = null;
  reportingTime = '10:00 AM';
  checkoutTime = '6:00 PM';

  constructor(
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
      this.attendanceData.employee_id = payload.id;
    }
    this.getAttendance();
    if (this.userRole === 'employee') {
      this.loadTodayStatus();
    }
  }

  getAttendance(){
    this.attendanceService.getAttendance()
    .subscribe((res:any)=>{
      this.attendanceList = res;
      this.cdr.detectChanges();
    });
  }

  loadTodayStatus(){
    this.attendanceService.getMyToday()
    .subscribe((res:any)=>{
      this.todayStatus = res;
      this.cdr.detectChanges();
    });
  }

  checkIn(){
    this.attendanceService.checkIn(this.attendanceData)
    .subscribe({
      next: (res:any)=>{
        this.toast.success('Check-in Successful');
        this.getAttendance();
        if (this.userRole === 'employee') {
          this.loadTodayStatus();
        }
      },
      error: (err:any)=>{
        console.error('Check-in error:', err);
        this.toast.error(err.error?.message || 'Check-in failed');
      }
    });
  }

  checkOut(id:any){
    this.attendanceService.checkOut(id)
    .subscribe({
      next: (res:any)=>{
        this.toast.success('Check-out Successful');
        this.getAttendance();
        if (this.userRole === 'employee') {
          this.loadTodayStatus();
        }
      },
      error: (err:any)=>{
        console.error('Check-out error:', err);
        this.toast.error(err.error?.message || 'Check-out failed');
      }
    });
  }

  employeeCheckOut(){
    if (this.todayStatus && this.todayStatus.id) {
      this.checkOut(this.todayStatus.id);
    }
  }

  getReport(){
    this.attendanceService.getReport(this.reportMonth, this.reportYear)
    .subscribe((res:any)=>{
      this.reportList = res;
      this.showReport = true;
      this.cdr.detectChanges();
    });
  }

  exportCSV(){
    const data = this.showReport ? this.reportList : this.attendanceList;
    const headers = ['ID','Employee','Status','Check In','Check Out'];
    const rows = data.map((a:any) =>
      [a.id, a.name, a.status, a.check_in || '', a.check_out || ''].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
    a.click();
  }

}