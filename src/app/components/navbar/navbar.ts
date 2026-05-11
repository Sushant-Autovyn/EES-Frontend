import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  unreadCount: number = 0;
  notifications: any[] = [];
  showNotifications: boolean = false;
  userRole: string = '';
  userName: string = '';
  showProfileMenu: boolean = false;

  constructor(
    private router: Router,
    private notifService: NotificationService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
      this.userName = payload.name || payload.email || 'User';
    }
  }

  ngOnInit() {
    this.loadUnreadCount();
    // Poll every 30 seconds
    setInterval(() => this.loadUnreadCount(), 30000);
  }

  loadUnreadCount() {
    this.notifService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount = res.count,
      error: () => {}
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notifService.getNotifications().subscribe({
        next: (res: any) => this.notifications = res,
        error: () => {}
      });
    }
  }

  markAsRead(id: number) {
    this.notifService.markAsRead(id).subscribe(() => {
      this.notifications = this.notifications.map(n =>
        n.id === id ? { ...n, is_read: 1 } : n
      );
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    });
  }

  markAllRead() {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications = this.notifications.map(n => ({ ...n, is_read: 1 }));
      this.unreadCount = 0;
    });
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper')) {
      this.showProfileMenu = false;
    }
    if (!target.closest('.notif-wrapper')) {
      this.showNotifications = false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

}
