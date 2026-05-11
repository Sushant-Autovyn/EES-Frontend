import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { AuditService } from '../../services/audit.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css'
})
export class AuditLogs implements OnInit {
  logs: any[] = [];
  searchAction = '';
  searchEmail = '';
  limit = 100;

  constructor(private auditService: AuditService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.auditService.getLogs({ action: this.searchAction, user_email: this.searchEmail, limit: this.limit })
      .subscribe((res: any) => { this.logs = res; this.cdr.detectChanges(); });
  }

  clearOld() {
    this.toast.confirm('Delete logs older than 90 days?', () => {
      this.auditService.clearOld().subscribe((res: any) => {
        this.toast.success(res.message); this.load();
      });
    });
  }

  getActionColor(action: string): string {
    if (action?.includes('login')) return '#4caf50';
    if (action?.includes('delete')) return '#f44336';
    if (action?.includes('update') || action?.includes('edit')) return '#ff9800';
    if (action?.includes('create') || action?.includes('add')) return '#2196f3';
    return '#666';
  }
}
