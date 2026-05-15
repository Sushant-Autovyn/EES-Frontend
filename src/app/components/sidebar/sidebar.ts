import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  isOpen = false;
  userRole = '';
  permissions: string[] = [];
  private sub!: Subscription;

  private apiUrl = 'https://ees-backend-production.up.railway.app/api/roles';

  constructor(private http: HttpClient, private roleService: RoleService, private cdr: ChangeDetectorRef, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
    }
    // Load cached permissions instantly so sidebar items show immediately
    const cached = localStorage.getItem('userPermissions');
    if (cached) {
      try { this.permissions = JSON.parse(cached); } catch { this.permissions = []; }
    }
  }

  ngOnInit(): void {
    this.loadPermissions();
    this.sub = this.roleService.rolesUpdated$.subscribe(() => {
      this.loadPermissions();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadPermissions() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<{ permissions: string[] }>(`${this.apiUrl}/my-permissions`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.permissions = res.permissions || [];
        localStorage.setItem('userPermissions', JSON.stringify(this.permissions));
        this.cdr.detectChanges();
      },
      error: () => {
        this.permissions = [];
      }
    });
  }

  hasPermission(perm: string): boolean {
    return this.permissions.includes(perm);
  }

  toggle(){
    this.isOpen = !this.isOpen;
  }

  close(){
    this.isOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userPermissions');
    this.router.navigate(['/']);
  }
}
