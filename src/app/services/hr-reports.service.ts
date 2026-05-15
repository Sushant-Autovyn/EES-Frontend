import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HrReportsService {
  apiUrl = 'https://ees-backend-production.up.railway.app/api/hr-reports';

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.get(this.apiUrl + '/summary');
  }

  getDepartments() {
    return this.http.get(this.apiUrl + '/departments');
  }

  getAttendanceTrend() {
    return this.http.get(this.apiUrl + '/attendance-trend');
  }

  getLeaveStats() {
    return this.http.get(this.apiUrl + '/leave-stats');
  }

  getRecentJoinings() {
    return this.http.get(this.apiUrl + '/recent-joinings');
  }
}
