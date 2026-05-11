import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { RecruitmentService } from '../../services/recruitment.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-hr-recruitment',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './hr-recruitment.html',
  styleUrl: './hr-recruitment.css'
})
export class HrRecruitment implements OnInit {
  candidates: any[] = [];
  summary: any = {};
  showForm = false;
  editMode = false;
  editId: number = 0;
  activeFilter = 'All';

  formData: any = {
    position: '',
    department: '',
    candidate_name: '',
    candidate_email: '',
    candidate_phone: '',
    notes: ''
  };

  statuses = ['Applied', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

  constructor(
    private recruitmentService: RecruitmentService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCandidates();
    this.loadSummary();
  }

  loadCandidates() {
    this.recruitmentService.getAll().subscribe((res: any) => {
      this.candidates = res;
      this.cdr.detectChanges();
    });
  }

  loadSummary() {
    this.recruitmentService.getSummary().subscribe((res: any) => {
      this.summary = res;
      this.cdr.detectChanges();
    });
  }

  get filteredCandidates() {
    if (this.activeFilter === 'All') return this.candidates;
    return this.candidates.filter(c => c.status === this.activeFilter);
  }

  openAdd() {
    this.formData = { position: '', department: '', candidate_name: '', candidate_email: '', candidate_phone: '', notes: '' };
    this.editMode = false;
    this.showForm = true;
  }

  submit() {
    if (this.editMode) {
      this.recruitmentService.updateCandidate(this.editId, this.formData).subscribe((res: any) => {
        this.toast.success(res.message);
        this.showForm = false;
        this.loadCandidates();
        this.loadSummary();
      });
    } else {
      this.recruitmentService.addCandidate(this.formData).subscribe((res: any) => {
        this.toast.success(res.message);
        this.showForm = false;
        this.loadCandidates();
        this.loadSummary();
      });
    }
  }

  updateStatus(candidate: any, newStatus: string) {
    this.recruitmentService.updateCandidate(candidate.id, { status: newStatus }).subscribe((res: any) => {
      this.toast.success('Status updated to ' + newStatus);
      this.loadCandidates();
      this.loadSummary();
    });
  }

  showInterviewModal = false;
  interviewCandidate: any = null;
  interviewDate = '';

  scheduleInterview(candidate: any) {
    this.interviewCandidate = candidate;
    this.interviewDate = '';
    this.showInterviewModal = true;
  }

  confirmInterview() {
    if (!this.interviewDate) { this.toast.error('Please select a date'); return; }
    this.recruitmentService.updateCandidate(this.interviewCandidate.id, { status: 'Interview', interview_date: this.interviewDate }).subscribe((res: any) => {
      this.toast.success('Interview scheduled');
      this.showInterviewModal = false;
      this.loadCandidates();
      this.loadSummary();
    });
  }

  deleteCandidate(id: number) {
    this.toast.confirm('Delete this candidate?', () => {
      this.recruitmentService.deleteCandidate(id).subscribe((res: any) => {
        this.toast.success(res.message);
        this.loadCandidates();
        this.loadSummary();
      });
    });
  }

  getStatusColor(status: string): string {
    const colors: any = { Applied: '#2196f3', Shortlisted: '#ff9800', Interview: '#9c27b0', Hired: '#4caf50', Rejected: '#f44336' };
    return colors[status] || '#666';
  }
}
