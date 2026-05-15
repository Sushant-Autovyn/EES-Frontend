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

  forgotPassword(phone:string, channel:string = 'whatsapp'){
    return this.http.post(`${this.apiUrl}/forgot-password`, { phone, channel });
  }

  resetPassword(data:any){
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  // Send a custom message via WhatsApp or SMS (admin/hr only).
  // Accepts a single phone string or an array of phone strings.
  sendMessage(phone: string | string[], message: string, channel: string = 'whatsapp'){
    const token = localStorage.getItem('token');
    return this.http.post(
      `${this.apiUrl}/send-message`,
      { phone, message, channel },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

}