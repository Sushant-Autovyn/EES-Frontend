import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class Auth {

  apiUrl =
    'https://ees-backend-production.up.railway.app/api/auth';

  constructor(
    private http: HttpClient
  ) { }

  login(data:any){
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data:any){
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  forgotPassword(email:string){
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data:any){
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

}