import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BranchService {
  private apiUrl = 'https://ees-backend-production.up.railway.app/api/branches';
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get(this.apiUrl); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
  getEmployees(id: number) { return this.http.get(`${this.apiUrl}/${id}/employees`); }
  assignEmployee(empId: number, branchId: number) { return this.http.put(`${this.apiUrl}/assign-employee/${empId}`, { branch_id: branchId }); }
}
