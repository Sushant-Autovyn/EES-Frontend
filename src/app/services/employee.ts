import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class Employee {

  apiUrl =
    'http://localhost:5000/api/employees';

  constructor(
    private http: HttpClient
  ) {}

  getEmployees(params?:any){
    let query = '';
    if(params){
      const p = new URLSearchParams();
      Object.keys(params).forEach(k => {
        if(params[k]) p.set(k, params[k]);
      });
      query = '?' + p.toString();
    }
    return this.http.get(this.apiUrl + query);
  }

  addEmployee(data:any){
    return this.http.post(this.apiUrl, data);
  }

  updateEmployee(id:any, data:any){
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteEmployee(id:any){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadImage(id:any, file:File){
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/upload/${id}`, formData);
  }

  getContacts(){
    return this.http.get(`${this.apiUrl}/contacts`);
  }

}