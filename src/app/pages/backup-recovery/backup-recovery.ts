import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { BackupService } from '../../services/backup.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-backup-recovery',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './backup-recovery.html',
  styleUrl: './backup-recovery.css'
})
export class BackupRecovery implements OnInit {
  backups: any[] = [];
  dbStats: any = {};
  creating = false;

  constructor(private backupService: BackupService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.backupService.getInfo().subscribe((res: any) => {
      this.backups = res.backups || [];
      this.dbStats = res.dbStats || {};
      this.cdr.detectChanges();
    });
  }

  createBackup() {
    this.creating = true;
    this.backupService.create().subscribe((res: any) => {
      this.toast.success(res.message);
      this.creating = false;
      this.load();
    }, (err) => {
      this.toast.error(err.error?.message || 'Backup failed');
      this.creating = false;
    });
  }

  deleteBackup(filename: string) {
    this.toast.confirm('Delete this backup?', () => {
      this.backupService.delete(filename).subscribe((res: any) => {
        this.toast.success(res.message); this.load();
      });
    });
  }

  downloadBackup(filename: string) {
    window.open(this.backupService.getDownloadUrl(filename), '_blank');
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
