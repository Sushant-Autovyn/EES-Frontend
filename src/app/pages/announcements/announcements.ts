import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { AnnouncementService } from '../../services/announcement.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './announcements.html',
  styleUrl: './announcements.css'
})
export class Announcements implements OnInit {
  announcements: any[] = [];
  showForm = false;
  formData = { title: '', message: '', target_role: 'all', priority: 'Normal' };
  roles = ['all', 'admin', 'hr', 'employee', 'accountant'];
  priorities = ['Low', 'Normal', 'High', 'Urgent'];

  constructor(private announcementService: AnnouncementService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.announcementService.getAll().subscribe((res: any) => { this.announcements = res; this.cdr.detectChanges(); });
  }

  submit() {
    if (!this.formData.title || !this.formData.message) { this.toast.error('Title and message are required'); return; }
    this.announcementService.create(this.formData).subscribe({
      next: () => {
        this.toast.success('Announcement sent successfully');
        this.showForm = false;
        this.formData = { title: '', message: '', target_role: 'all', priority: 'Normal' };
        this.load();
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Failed to send announcement');
      }
    });
  }

  deleteAnnouncement(id: number) {
    this.toast.confirm('Delete this announcement?', () => {
      this.announcementService.delete(id).subscribe((res: any) => {
        this.toast.success(res.message); this.load();
      });
    });
  }

  getPriorityColor(p: string): string {
    const c: any = { Low: '#4caf50', Normal: '#2196f3', High: '#ff9800', Urgent: '#f44336' };
    return c[p] || '#666';
  }
}
