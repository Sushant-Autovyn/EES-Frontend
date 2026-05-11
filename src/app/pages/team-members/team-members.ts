import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { Employee as EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './team-members.html',
  styleUrl: './team-members.css'
})
export class TeamMembers implements OnInit {

  members: any[] = [];
  filteredMembers: any[] = [];
  searchText = '';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.employeeService.getContacts().subscribe((res: any) => {
      this.members = res;
      this.filteredMembers = res;
      this.cdr.detectChanges();
    });
  }

  onSearch() {
    const q = this.searchText.toLowerCase();
    this.filteredMembers = this.members.filter((m: any) =>
      m.name?.toLowerCase().includes(q) ||
      m.department?.toLowerCase().includes(q) ||
      m.phone?.includes(q)
    );
  }
}
