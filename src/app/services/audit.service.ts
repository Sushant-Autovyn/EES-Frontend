import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private apiUrl = 'https://ees-backend-production.up.railway.app/api/audit';
  constructor(private http: HttpClient) {}

  getLogs(params?: any) {
    let query = '';
    if (params) {
      const p = new URLSearchParams();
      Object.keys(params).forEach(k => { if (params[k]) p.set(k, params[k]); });
      query = '?' + p.toString();
    }
    return this.http.get(this.apiUrl + query);
  }
  clearOld() { return this.http.delete(`${this.apiUrl}/clear-old`); }
}
