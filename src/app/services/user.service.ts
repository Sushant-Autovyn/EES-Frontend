import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://ees-backend-production.up.railway.app/api/users';
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get(this.apiUrl); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data); }
  deactivate(id: number) { return this.http.put(`${this.apiUrl}/deactivate/${id}`, {}); }
  activate(id: number, role: string) { return this.http.put(`${this.apiUrl}/activate/${id}`, { role }); }
  resetPassword(id: number, newPassword: string) { return this.http.put(`${this.apiUrl}/reset-password/${id}`, { newPassword }); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
