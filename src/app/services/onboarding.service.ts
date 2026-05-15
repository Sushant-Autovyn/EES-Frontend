import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  apiUrl = 'https://ees-backend-production.up.railway.app/api/onboarding';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.apiUrl);
  }

  getByEmployee(id: number) {
    return this.http.get(this.apiUrl + '/employee/' + id);
  }

  addStep(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  completeStep(id: number) {
    return this.http.put(this.apiUrl + '/complete/' + id, {});
  }

  initOnboarding(employeeId: number) {
    return this.http.post(this.apiUrl + '/init/' + employeeId, {});
  }

  deleteStep(id: number) {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
