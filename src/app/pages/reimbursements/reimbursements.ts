import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { ReimbursementService } from '../../services/reimbursement.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reimbursements',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './reimbursements.html',
  styleUrl: './reimbursements.css'
})
export class ReimbursementsComponent implements OnInit {
  claims: any[] = [];
  summary: any = {};
  showForm = false;
  filterStatus = 'all';

  formData = {
    employee_id: '',
    type: '',
    amount: 0,
    description: ''
  };

  typeOptions = ['Travel', 'Office Supplies', 'Food', 'Medical', 'Training', 'Equipment', 'Other'];

  constructor(
    private reimbService: ReimbursementService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadClaims();
    this.loadSummary();
  }

  loadClaims() {
    this.reimbService.getAll().subscribe((res: any) => {
      this.claims = res;
      this.cdr.detectChanges();
    });
  }

  loadSummary() {
    this.reimbService.getSummary().subscribe((res: any) => {
      this.summary = res;
      this.cdr.detectChanges();
    });
  }

  get filteredClaims() {
    if (this.filterStatus === 'all') return this.claims;
    return this.claims.filter(c => c.status === this.filterStatus);
  }

  submit() {
    if (!this.formData.type || !this.formData.amount) {
      this.toast.warning('Fill in type and amount');
      return;
    }
    this.reimbService.submit(this.formData).subscribe({
      next: () => {
        this.toast.success('Reimbursement submitted');
        this.loadClaims();
        this.loadSummary();
        this.showForm = false;
        this.resetForm();
      },
      error: (err: any) => this.toast.error(err.error?.message || 'Submit failed')
    });
  }

  approve(id: number) {
    this.reimbService.approve(id).subscribe(() => {
      this.toast.success('Reimbursement approved');
      this.loadClaims();
      this.loadSummary();
    });
  }

  reject(id: number) {
    this.reimbService.reject(id).subscribe(() => {
      this.toast.success('Reimbursement rejected');
      this.loadClaims();
      this.loadSummary();
    });
  }

  resetForm() {
    this.formData = { employee_id: '', type: '', amount: 0, description: '' };
  }
}
