import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReimbursementService {
  private apiUrl = 'https://ees-backend-production.up.railway.app/api/reimbursements';

  constructor(private http: HttpClient) {}

  getAll(){ return this.http.get(this.apiUrl); }
  getMy(){ return this.http.get(`${this.apiUrl}/my`); }
  submit(data:any){ return this.http.post(this.apiUrl, data); }
  approve(id:any){ return this.http.put(`${this.apiUrl}/approve/${id}`, {}); }
  reject(id:any){ return this.http.put(`${this.apiUrl}/reject/${id}`, {}); }
  getSummary(){ return this.http.get(`${this.apiUrl}/summary`); }
}
