import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { DocumentService } from '../../services/document.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './my-documents.html',
  styleUrl: './my-documents.css'
})
export class MyDocuments implements OnInit {
  documents: any[] = [];
  showUpload = false;
  filterStatus = '';

  docTypes = ['ID Proof', 'Resume', 'Offer Letter', 'Experience Letter', 'Certificate', 'Bank Details', 'Address Proof', 'PAN Card', 'Aadhar Card', 'Other'];

  uploadData = { doc_type: '', doc_name: '' };
  selectedFile: File | null = null;

  constructor(
    private documentService: DocumentService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.documentService.getAll().subscribe((res: any) => {
      this.documents = res;
      this.cdr.detectChanges();
    });
  }

  get filteredDocs() {
    if (!this.filterStatus) return this.documents;
    return this.documents.filter(d => d.status === this.filterStatus);
  }

  get pendingCount() { return this.documents.filter(d => d.status === 'Pending').length; }
  get approvedCount() { return this.documents.filter(d => d.status === 'Approved').length; }
  get rejectedCount() { return this.documents.filter(d => d.status === 'Rejected').length; }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  upload() {
    if (!this.uploadData.doc_type || !this.selectedFile) {
      this.toast.error('Please select document type and file');
      return;
    }
    const formData = new FormData();
    formData.append('doc_type', this.uploadData.doc_type);
    formData.append('doc_name', this.uploadData.doc_name || this.selectedFile.name);
    formData.append('document', this.selectedFile);

    this.documentService.upload(formData).subscribe((res: any) => {
      this.toast.success(res.message);
      this.showUpload = false;
      this.selectedFile = null;
      this.uploadData = { doc_type: '', doc_name: '' };
      this.load();
    }, (err) => this.toast.error(err.error?.message || 'Upload failed'));
  }

  viewDoc(url: string) {
    window.open('https://ees-backend-production.up.railway.app/uploads/' + url, '_blank');
  }

  getStatusClass(status: string): string {
    return status === 'Approved' ? 'approved' : status === 'Rejected' ? 'rejected' : 'pending';
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      'ID Proof': 'fa-id-card', 'Resume': 'fa-file-alt', 'Offer Letter': 'fa-envelope-open',
      'Experience Letter': 'fa-briefcase', 'Certificate': 'fa-certificate',
      'Bank Details': 'fa-university', 'Address Proof': 'fa-map-marker-alt',
      'PAN Card': 'fa-credit-card', 'Aadhar Card': 'fa-address-card', 'Other': 'fa-file'
    };
    return icons[type] || 'fa-file';
  }
}
