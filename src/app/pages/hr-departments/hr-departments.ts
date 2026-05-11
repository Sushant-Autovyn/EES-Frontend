import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../services/employee';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-hr-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './hr-departments.html',
  styleUrl: './hr-departments.css'
})
export class HrDepartments implements OnInit {
  departments: any[] = [];
  employees: any[] = [];
  showForm = false;
  editMode = false;
  editId: number = 0;

  formData: any = {
    name: '',
    head_id: '',
    description: '',
    status: 'Active'
  };

  apiUrl = 'http://localhost:5000/api/departments';

  constructor(
    private http: HttpClient,
    private employeeService: Employee,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadEmployees();
  }

  loadDepartments() {
    this.http.get(this.apiUrl + '/all').subscribe((res: any) => {
      this.departments = res;
      this.cdr.detectChanges();
    });
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((res: any) => {
      this.employees = res;
      this.cdr.detectChanges();
    });
  }

  openAdd() {
    this.formData = { name: '', head_id: '', description: '', status: 'Active' };
    this.editMode = false;
    this.showForm = true;
  }

  openEdit(dept: any) {
    this.formData = { name: dept.name, head_id: dept.head_id || '', description: dept.description || '', status: dept.status };
    this.editId = dept.id;
    this.editMode = true;
    this.showForm = true;
  }

  submit() {
    if (this.editMode) {
      this.http.put(this.apiUrl + '/' + this.editId, this.formData).subscribe((res: any) => {
        this.toast.success(res.message);
        this.showForm = false;
        this.loadDepartments();
      });
    } else {
      this.http.post(this.apiUrl, this.formData).subscribe((res: any) => {
        this.toast.success(res.message);
        this.showForm = false;
        this.loadDepartments();
      });
    }
  }

  deleteDept(id: number) {
    this.toast.confirm('Delete this department?', () => {
      this.http.delete(this.apiUrl + '/' + id).subscribe((res: any) => {
        this.toast.success(res.message);
        this.loadDepartments();
      });
    });
  }

  getEmployeeCount(deptName: string): number {
    return this.employees.filter(e => e.department === deptName).length;
  }

  getHeadName(headId: number): string {
    const emp = this.employees.find(e => e.id === headId);
    return emp ? emp.name : 'Not Assigned';
  }
}
