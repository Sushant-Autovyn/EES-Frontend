import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class Dashboard {

  apiUrl =
    'http://localhost:5000/api/dashboard';

  constructor(
    private http: HttpClient
  ) {}

  getStats(){
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getEmployeeStats(){
    return this.http.get(`${this.apiUrl}/stats/employee`);
  }

  getHrStats(){
    return this.http.get(`${this.apiUrl}/stats/hr`);
  }

  getAccountantStats(){
    return this.http.get(`${this.apiUrl}/stats/accountant`);
  }

}