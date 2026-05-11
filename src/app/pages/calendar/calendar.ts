import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { Attendance as AttendanceService } from '../../services/attendance';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar implements OnInit {

  calendarMonth = new Date().getMonth() + 1;
  calendarYear = new Date().getFullYear();
  calendarDays: any[] = [];
  calendarAttendance: any[] = [];
  todayStatus: any = null;
  reportingTime = '10:00 AM';
  checkoutTime = '6:00 PM';

  constructor(
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTodayStatus();
    this.loadCalendar();
  }

  loadTodayStatus() {
    this.attendanceService.getMyToday().subscribe((res: any) => {
      this.todayStatus = res;
      this.cdr.detectChanges();
    });
  }

  loadCalendar() {
    this.attendanceService.getCalendar(this.calendarMonth, this.calendarYear)
      .subscribe((res: any) => {
        this.calendarAttendance = res;
        this.buildCalendar();
        this.cdr.detectChanges();
      });
  }

  buildCalendar() {
    const year = this.calendarYear;
    const month = this.calendarMonth - 1;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    this.calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({ day: null, status: '' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record = this.calendarAttendance.find((a: any) => {
        const aDate = typeof a.date === 'string' ? a.date.split('T')[0] : '';
        return aDate === dateStr;
      });

      let status = '';
      const cellDate = new Date(year, month, d);

      if (record) {
        if (record.status === 'Present' && record.check_out) {
          status = 'present';
        } else if (record.status === 'Present' && !record.check_out) {
          status = 'checked-in';
        } else if (record.status === 'Absent') {
          status = 'absent';
        }
      } else if (cellDate < today && cellDate.getDay() !== 0 && cellDate.getDay() !== 6) {
        if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
          status = 'today';
        } else {
          status = 'missed';
        }
      } else if (cellDate.getDay() === 0 || cellDate.getDay() === 6) {
        status = 'weekend';
      } else if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
        status = 'today';
      }

      this.calendarDays.push({ day: d, status, date: dateStr });
    }
  }

  prevMonth() {
    if (this.calendarMonth === 1) {
      this.calendarMonth = 12;
      this.calendarYear--;
    } else {
      this.calendarMonth--;
    }
    this.loadCalendar();
  }

  nextMonth() {
    if (this.calendarMonth === 12) {
      this.calendarMonth = 1;
      this.calendarYear++;
    } else {
      this.calendarMonth++;
    }
    this.loadCalendar();
  }

  getMonthName() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.calendarMonth - 1];
  }
}
