import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private apiUrl = 'http://localhost:5000/api/complaints';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<any[]>(this.apiUrl); }
  getMy() { return this.http.get<any[]>(`${this.apiUrl}/my`); }
  submit(formData: FormData) { return this.http.post(this.apiUrl, formData); }
  updateStatus(id: number, body: { status: string; admin_response?: string }) {
    return this.http.put(`${this.apiUrl}/status/${id}`, body);
  }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
