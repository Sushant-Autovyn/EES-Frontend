import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BackupService {
  private apiUrl = 'https://ees-backend-production.up.railway.app/api/backup';
  constructor(private http: HttpClient) {}

  getInfo() { return this.http.get(`${this.apiUrl}/info`); }
  create() { return this.http.post(`${this.apiUrl}/create`, {}); }
  delete(filename: string) { return this.http.delete(`${this.apiUrl}/${filename}`); }
  getDownloadUrl(filename: string) { return `${this.apiUrl}/download/${filename}`; }
}
