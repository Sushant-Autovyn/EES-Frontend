import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { ComplaintService } from '../../services/complaint.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-my-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './my-complaints.html',
  styleUrl: './my-complaints.css'
})
export class MyComplaints implements OnInit {
  complaints: any[] = [];
  showForm = false;
  filterStatus = 'all';
  uploadFile: File | null = null;

  form = {
    subject: '',
    category: 'Workplace',
    description: ''
  };

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
    this.complaintService.getMy().subscribe({
      next: (res) => { this.complaints = res || []; this.cdr.detectChanges(); },
      error: () => this.toast.error('Failed to load complaints')
    });
  }

  get filtered() {
    if (this.filterStatus === 'all') return this.complaints;
    return this.complaints.filter(c => c.status === this.filterStatus);
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) this.uploadFile = file;
  }

  openForm() {
    this.showForm = true;
    this.form = { subject: '', category: 'Workplace', description: '' };
    this.uploadFile = null;
  }

  closeForm() {
    this.showForm = false;
  }

  submit() {
    if (!this.form.subject.trim() || !this.form.description.trim()) {
      this.toast.error('Please fill subject and description');
      return;
    }
    const fd = new FormData();
    fd.append('subject', this.form.subject);
    fd.append('category', this.form.category);
    fd.append('description', this.form.description);
    if (this.uploadFile) fd.append('attachment', this.uploadFile);

    this.complaintService.submit(fd).subscribe({
      next: () => {
        this.toast.success('Complaint submitted successfully');
        this.closeForm();
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message || 'Submission failed')
    });
  }

  cancel(c: any) {
    if (c.status !== 'Pending') {
      this.toast.error('Only pending complaints can be cancelled');
      return;
    }
    if (!confirm('Cancel this complaint?')) return;
    this.complaintService.delete(c.id).subscribe({
      next: () => { this.toast.success('Complaint cancelled'); this.load(); },
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
