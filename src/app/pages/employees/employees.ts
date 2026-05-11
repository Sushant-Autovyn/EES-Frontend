import { Component, OnInit, ChangeDetectorRef }
from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import { Sidebar }
from '../../components/sidebar/sidebar';

import { Navbar }
from '../../components/navbar/navbar';

import { Employee }
from '../../services/employee';

import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Navbar
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})

export class Employees
implements OnInit {

  employees:any[] = [];
  searchText = '';
  filterDepartment = '';
  filterStatus = '';
  currentPage = 1;
  pageSize = 10;
  editMode = false;
  editId:any = null;
  showForm = false;

  employeeData = {
    name:'',
    email:'',
    phone:'',
    department:'',
    designation:'',
    salary:'',
    status:'Active'
  };

  constructor(
    private employee: Employee,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(){
    const params:any = {};
    if(this.searchText) params.search = this.searchText;
    if(this.filterDepartment) params.department = this.filterDepartment;
    if(this.filterStatus) params.status = this.filterStatus;
    params.page = this.currentPage;
    params.limit = this.pageSize;

    this.employee.getEmployees(params)
    .subscribe((res:any)=>{
      this.employees = res;
      this.cdr.detectChanges();
    });
  }

  onSearch(){
    this.currentPage = 1;
    this.getEmployees();
  }

  nextPage(){
    this.currentPage++;
    this.getEmployees();
  }

  prevPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.getEmployees();
    }
  }

  toggleForm(){
    this.showForm = !this.showForm;
    if(!this.showForm) this.resetForm();
  }

  addEmployee(){
    if(this.editMode){
      this.employee.updateEmployee(this.editId, this.employeeData)
      .subscribe((res:any)=>{
        this.toast.success('Employee Updated');
        this.getEmployees();
        this.resetForm();
      });
    } else {
      this.employee.addEmployee(this.employeeData)
      .subscribe((res:any)=>{
        this.toast.success('Employee Added');
        this.getEmployees();
        this.resetForm();
      });
    }
  }

  editEmployee(emp:any){
    this.editMode = true;
    this.editId = emp.id;
    this.showForm = true;
    this.employeeData = {
      name: emp.name,
      email: emp.email,
      phone: emp.phone || '',
      department: emp.department || '',
      designation: emp.designation || '',
      salary: emp.salary,
      status: emp.status || 'Active'
    };
  }

  deleteEmployee(id:any){
    this.toast.confirm('This will permanently delete this employee. Continue?', () => {
      this.employee.deleteEmployee(id)
      .subscribe((res:any)=>{
        this.toast.success('Employee Deleted');
        this.getEmployees();
      });
    });
  }

  uploadImage(event:any, id:any){
    const file = event.target.files[0];
    if(file){
      this.employee.uploadImage(id, file)
      .subscribe((res:any)=>{
        this.toast.success('Image Uploaded');
        this.getEmployees();
      });
    }
  }

  resetForm(){
    this.editMode = false;
    this.editId = null;
    this.showForm = false;
    this.employeeData = {
      name:'', email:'', phone:'', department:'',
      designation:'', salary:'', status:'Active'
    };
  }

  exportCSV(){
    const headers = ['ID','Name','Email','Phone','Department','Designation','Salary','Status'];
    const rows = this.employees.map(e =>
      [e.id, e.name, e.email, e.phone, e.department, e.designation, e.salary, e.status].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
  }

}