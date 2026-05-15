import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Employee } from '../../services/employee';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-message.html',
  styleUrl: './send-message.css'
})
export class SendMessage implements OnInit {

  // Recipients
  recipients: string[] = [];
  phoneInput = '';
  showPicker = false;
  employees: any[] = [];
  filteredEmployees: any[] = [];
  employeeSearch = '';

  // Message
  message = '';
  channel: 'whatsapp' | 'sms' = 'whatsapp';
  sending = false;
  lastResult: any = null;

  constructor(
    private auth: Auth,
    private employeeSvc: Employee,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.employeeSvc.getEmployees().subscribe({
      next: (res: any) => {
        this.employees = (res || []).filter((e: any) => e.phone);
        this.filteredEmployees = this.employees;
      },
      error: () => {}
    });
  }

  // ---------- recipients ----------

  addPhone(value?: string) {
    const raw = (value ?? this.phoneInput) || '';
    const parts = raw.split(/[,\n;\s]+/).map(p => p.trim()).filter(Boolean);
    for (const p of parts) {
      if (!this.recipients.includes(p)) this.recipients.push(p);
    }
    this.phoneInput = '';
  }

  onPhoneKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      this.addPhone();
    } else if (e.key === 'Backspace' && !this.phoneInput && this.recipients.length) {
      this.recipients.pop();
    }
  }

  removeRecipient(p: string) {
    this.recipients = this.recipients.filter(r => r !== p);
  }

  clearAll() {
    this.recipients = [];
  }

  // ---------- employee picker ----------

  togglePicker() {
    this.showPicker = !this.showPicker;
    if (this.showPicker) {
      this.employeeSearch = '';
      this.filteredEmployees = this.employees;
    }
  }

  filterEmployees() {
    const q = this.employeeSearch.toLowerCase();
    this.filteredEmployees = this.employees.filter(e =>
      (e.name || '').toLowerCase().includes(q) ||
      (e.phone || '').includes(q) ||
      (e.email || '').toLowerCase().includes(q)
    );
  }

  isSelected(emp: any): boolean {
    return this.recipients.includes(emp.phone);
  }

  toggleEmployee(emp: any) {
    if (this.isSelected(emp)) {
      this.removeRecipient(emp.phone);
    } else {
      this.recipients.push(emp.phone);
    }
  }

  selectAllVisible() {
    for (const e of this.filteredEmployees) {
      if (!this.recipients.includes(e.phone)) this.recipients.push(e.phone);
    }
  }

  // ---------- send ----------

  send() {
    if (this.sending) return;

    // Pick up anything still typed in the input
    if (this.phoneInput.trim()) this.addPhone();

    if (this.recipients.length === 0 || !this.message.trim()) {
      this.toast.warning('Add at least one recipient and a message');
      return;
    }

    this.sending = true;
    this.lastResult = null;
    this.auth.sendMessage(this.recipients, this.message, this.channel).subscribe({
      next: (res: any) => {
        this.sending = false;
        this.lastResult = res;
        if (res.failed > 0) {
          this.toast.info(res.message);
        } else {
          this.toast.success(res.message);
          this.message = '';
        }
      },
      error: (err) => {
        this.sending = false;
        this.toast.error(err.error?.message || 'Failed to send message');
      }
    });
  }
}
