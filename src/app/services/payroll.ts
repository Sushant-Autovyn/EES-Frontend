import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class Payroll {

  apiUrl = 'https://ees-backend-production.up.railway.app/api/payroll';

  constructor(private http: HttpClient) {}

  // Payroll records
  getPayroll(){ return this.http.get(this.apiUrl); }
  generatePayroll(data:any){ return this.http.post(`${this.apiUrl}/generate`, data); }
  processPayment(id:any){ return this.http.put(`${this.apiUrl}/pay/${id}`, {}); }

  // Salary structure
  getSalaries(){ return this.http.get(`${this.apiUrl}/salary`); }
  getSalary(empId:any){ return this.http.get(`${this.apiUrl}/salary/${empId}`); }
  saveSalary(data:any){ return this.http.post(`${this.apiUrl}/salary`, data); }

  // Payslip
  getPayslip(id:any){ return this.http.get(`${this.apiUrl}/payslip/${id}`); }

  // Attendance summary
  getAttendanceSummary(month:number, year:number){
    return this.http.get(`${this.apiUrl}/attendance-summary?month=${month}&year=${year}`);
  }

  // Reports
  getReportSummary(month:number, year:number){
    return this.http.get(`${this.apiUrl}/reports/summary?month=${month}&year=${year}`);
  }
  getDepartmentReport(month:number, year:number){
    return this.http.get(`${this.apiUrl}/reports/department?month=${month}&year=${year}`);
  }

  // Employees list
  getEmployeesList(){ return this.http.get(`${this.apiUrl}/employees/list`); }
}