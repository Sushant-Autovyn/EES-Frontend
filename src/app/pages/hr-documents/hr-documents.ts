import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { DocumentService } from '../../services/document.service';
import { Employee } from '../../services/employee';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-hr-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './hr-documents.html',
  styleUrl: './hr-documents.css'
})
export class HrDocuments implements OnInit {
  documents: any[] = [];
  employees: any[] = [];
  showUpload = false;
  selectedEmployee: number = 0;
  filterType = '';
  filterStatus = '';
  searchTerm = '';

  showReview = false;
  reviewDoc: any = null;
  reviewAction = '';
  reviewRemarks = '';

  docTypes = ['ID Proof', 'Resume', 'Offer Letter', 'Experience Letter', 'Certificate', 'Bank Details', 'Address Proof', 'Other'];

  uploadData = {
    employee_id: 0,
    doc_type: '',
    doc_name: ''
  };
  selectedFile: File | null = null;

  constructor(
    private documentService: DocumentService,
    private employeeService: Employee,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDocuments();
    this.loadEmployees();
  }

  loadDocuments() {
    this.documentService.getAll().subscribe((res: any) => {
      this.documents = res;
      this.cdr.detectChanges();
    });
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((res: any) => {
      this.employees = res;
      this.cdr.detectChanges();
    });
  }

  get filteredDocuments() {
    let docs = this.documents;
    if (this.filterType) docs = docs.filter(d => d.doc_type === this.filterType);
    if (this.filterStatus) docs = docs.filter(d => d.status === this.filterStatus);
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      docs = docs.filter(d =>
        d.employee_name?.toLowerCase().includes(term) ||
        d.doc_name?.toLowerCase().includes(term)
      );
    }
    return docs;
  }

  get pendingCount() { return this.documents.filter(d => d.status === 'Pending').length; }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  upload() {
    if (!this.uploadData.employee_id || !this.uploadData.doc_type || !this.selectedFile) {
      this.toast.error('Please fill all fields');
      return;
    }
    const formData = new FormData();
    formData.append('employee_id', this.uploadData.employee_id.toString());
    formData.append('doc_type', this.uploadData.doc_type);
    formData.append('doc_name', this.uploadData.doc_name || this.selectedFile.name);
    formData.append('document', this.selectedFile);

    this.documentService.upload(formData).subscribe((res: any) => {
      this.toast.success(res.message);
      this.showUpload = false;
      this.selectedFile = null;
      this.uploadData = { employee_id: 0, doc_type: '', doc_name: '' };
      this.loadDocuments();
    });
  }

  deleteDoc(id: number) {
    this.toast.confirm('Delete this document?', () => {
      this.documentService.delete(id).subscribe((res: any) => {
        this.toast.success(res.message);
        this.loadDocuments();
      });
    });
  }

  viewDoc(url: string) {
    window.open('https://ees-backend-production.up.railway.app/uploads/' + url, '_blank');
  }

  openReview(doc: any, action: string) {
    this.reviewDoc = doc;
    this.reviewAction = action;
    this.reviewRemarks = '';
    this.showReview = true;
  }

  submitReview() {
    if (!this.reviewDoc) return;
    const obs = this.reviewAction === 'approve'
      ? this.documentService.approve(this.reviewDoc.id, this.reviewRemarks)
      : this.documentService.reject(this.reviewDoc.id, this.reviewRemarks);

    obs.subscribe((res: any) => {
      this.toast.success(res.message);
      this.showReview = false;
      this.loadDocuments();
    }, (err) => this.toast.error(err.error?.message || 'Error'));
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      'ID Proof': 'fa-id-card', 'Resume': 'fa-file-alt', 'Offer Letter': 'fa-envelope-open',
      'Experience Letter': 'fa-briefcase', 'Certificate': 'fa-certificate',
      'Bank Details': 'fa-university', 'Address Proof': 'fa-map-marker-alt', 'Other': 'fa-file'
    };
    return icons[type] || 'fa-file';
  }
}
