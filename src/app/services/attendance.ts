import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class Attendance {

  apiUrl =
    'https://ees-backend-production.up.railway.app/api/attendance';

  constructor(
    private http: HttpClient
  ) {}

  getAttendance(){
    return this.http.get(this.apiUrl);
  }

  checkIn(data:any){
    return this.http.post(`${this.apiUrl}/checkin`, data);
  }

  checkOut(id:any){
    return this.http.put(`${this.apiUrl}/checkout/${id}`, {});
  }

  getReport(month:number, year:number){
    return this.http.get(`${this.apiUrl}/report?month=${month}&year=${year}`);
  }

  getMyAttendance(){
    return this.http.get(`${this.apiUrl}/my`);
  }

  getMyToday(){
    return this.http.get(`${this.apiUrl}/my/today`);
  }

  getCalendar(month:number, year:number){
    return this.http.get(`${this.apiUrl}/calendar?month=${month}&year=${year}`);
  }

}