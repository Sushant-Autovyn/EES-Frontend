import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { Dashboard as DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar,Sidebar,CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  stats:any = {};
  userRole: string = '';

  constructor(
    private dashboard: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
    }
    this.getDashboardStats();
  }

  getDashboardStats(){
    let request;

    switch(this.userRole) {
      case 'admin':
        request = this.dashboard.getStats();
        break;
      case 'employee':
        request = this.dashboard.getEmployeeStats();
        break;
      case 'hr':
        request = this.dashboard.getHrStats();
        break;
      case 'accountant':
        request = this.dashboard.getAccountantStats();
        break;
      default:
        request = this.dashboard.getStats();
    }

    request.subscribe({
      next: (res:any) => {
        this.stats = res;
        this.cdr.detectChanges();
      },
      error: (err:any) => {
        console.error('Dashboard error:', err);
      }
    });
  }

}
