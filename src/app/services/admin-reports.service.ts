import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminReportsService {
  private apiUrl = 'http://localhost:5000/api/admin-reports';
  constructor(private http: HttpClient) {}

  getSummary() { return this.http.get(`${this.apiUrl}/summary`); }
  getEmployeeReport() { return this.http.get(`${this.apiUrl}/employees`); }
  getAttendanceReport(from?: string, to?: string) {
    let q = '';
    if (from && to) q = `?from=${from}&to=${to}`;
    return this.http.get(`${this.apiUrl}/attendance${q}`);
  }
  getPayrollReport() { return this.http.get(`${this.apiUrl}/payroll`); }
  getDepartmentReport() { return this.http.get(`${this.apiUrl}/departments`); }
  getLeaveReport() { return this.http.get(`${this.apiUrl}/leaves`); }
}
