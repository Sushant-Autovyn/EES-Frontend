import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class Leave {

  apiUrl =
    'https://ees-backend-production.up.railway.app/api/leaves';

  constructor(
    private http: HttpClient
  ) {}

  getLeaves(){
    return this.http.get(this.apiUrl);
  }

  applyLeave(data:any){
    return this.http.post(this.apiUrl, data);
  }

  approveLeave(id:any){
    return this.http.put(`${this.apiUrl}/approve/${id}`, {});
  }

  rejectLeave(id:any){
    return this.http.put(`${this.apiUrl}/reject/${id}`, {});
  }

  getBalance(){
    return this.http.get(`${this.apiUrl}/balance`);
  }

}