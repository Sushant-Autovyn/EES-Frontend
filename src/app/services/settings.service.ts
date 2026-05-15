import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private apiUrl = 'https://ees-backend-production.up.railway.app/api/settings';
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get(this.apiUrl); }
  getByCategory(cat: string) { return this.http.get(`${this.apiUrl}/category/${cat}`); }
  update(id: number, value: string) { return this.http.put(`${this.apiUrl}/${id}`, { setting_value: value }); }
  add(data: any) { return this.http.post(this.apiUrl, data); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
