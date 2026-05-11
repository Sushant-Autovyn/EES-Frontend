import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  apiUrl = 'https://ees-backend-production.up.railway.app/api/documents';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.apiUrl);
  }

  getByEmployee(id: number) {
    return this.http.get(this.apiUrl + '/employee/' + id);
  }

  upload(formData: FormData) {
    return this.http.post(this.apiUrl, formData);
  }

  approve(id: number, remarks: string) {
    return this.http.put(this.apiUrl + '/approve/' + id, { remarks });
  }

  reject(id: number, remarks: string) {
    return this.http.put(this.apiUrl + '/reject/' + id, { remarks });
  }

  delete(id: number) {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
