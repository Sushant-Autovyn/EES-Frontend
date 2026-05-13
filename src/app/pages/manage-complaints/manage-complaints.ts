import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { ComplaintService } from '../../services/complaint.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-manage-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './manage-complaints.html',
  styleUrl: './manage-complaints.css'
})
export class ManageComplaints implements OnInit {
  complaints: any[] = [];
  filterStatus = 'all';
  filterCategory = 'all';
  search = '';

  // Modal state
  selected: any = null;
  newStatus = 'In Progress';
  adminResponse = '';

  statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  categories = ['Workplace', 'Harassment', 'Payroll', 'Manager', 'Facilities', 'Other'];

  constructor(
    private complaintService: ComplaintService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.complaintService.getAll().subscribe({
      next: (res) => { this.complaints = res || []; this.cdr.detectChanges(); },
      error: () => this.toast.error('Failed to load complaints')
    });
  }

  get filtered() {
    return this.complaints.filter(c => {
      if (this.filterStatus !== 'all' && c.status !== this.filterStatus) return false;
      if (this.filterCategory !== 'all' && c.category !== this.filterCategory) return false;
      if (this.search) {
        const q = this.search.toLowerCase();
        const hay = `${c.subject} ${c.description} ${c.employee_name || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  get stats() {
    return {
      total: this.complaints.length,
      pending: this.complaints.filter(c => c.status === 'Pending').length,
      inProgress: this.complaints.filter(c => c.status === 'In Progress').length,
      resolved: this.complaints.filter(c => c.status === 'Resolved').length,
      rejected: this.complaints.filter(c => c.status === 'Rejected').length
    };
  }

  openDetails(c: any) {
    this.selected = c;
    this.newStatus = c.status === 'Pending' ? 'In Progress' : c.status;
    this.adminResponse = c.admin_response || '';
  }

  closeDetails() {
    this.selected = null;
  }

  updateStatus() {
    if (!this.selected) return;
    if (!this.adminResponse.trim() && (this.newStatus === 'Resolved' || this.newStatus === 'Rejected')) {
      this.toast.error('Please add a response when resolving or rejecting');
      return;
    }
    this.complaintService.updateStatus(this.selected.id, {
      status: this.newStatus,
      admin_response: this.adminResponse
    }).subscribe({
      next: () => {
        this.toast.success('Complaint updated');
        this.closeDetails();
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message || 'Update failed')
    });
  }

  delete(c: any) {
    if (!confirm(`Delete complaint "${c.subject}"?`)) return;
    this.complaintService.delete(c.id).subscribe({
      next: () => { this.toast.success('Complaint deleted'); this.load(); },
      error: (err) => this.toast.error(err?.error?.message || 'Delete failed')
    });
  }

  statusClass(status: string) {
    return 'status-' + (status || '').toLowerCase().replace(/\s+/g, '-');
  }

  iconForCategory(cat: string) {
    const map: any = {
      Workplace: 'fa-building',
      Harassment: 'fa-user-shield',
      Payroll: 'fa-money-bill-wave',
      Manager: 'fa-user-tie',
      Facilities: 'fa-tools',
      Other: 'fa-tag'
    };
    return map[cat] || 'fa-tag';
  }
}
