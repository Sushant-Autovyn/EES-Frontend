import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService {
  apiUrl = 'https://ees-backend-production.up.railway.app/api/recruitment';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.apiUrl);
  }

  getSummary() {
    return this.http.get(this.apiUrl + '/summary');
  }

  addCandidate(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateCandidate(id: number, data: any) {
    return this.http.put(this.apiUrl + '/' + id, data);
  }

  deleteCandidate(id: number) {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
