import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ConfirmDialog } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-overlay" *ngIf="visible" (click)="cancel()">
      <div class="confirm-box" (click)="$event.stopPropagation()">
        <div class="confirm-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ef4444" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h3>Are you sure?</h3>
        <p>{{ message }}</p>
        <div class="confirm-actions">
          <button class="cancel-btn" (click)="cancel()">Cancel</button>
          <button class="delete-btn" (click)="confirmAction()">Yes, Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .confirm-box {
      background: white;
      border-radius: 16px;
      padding: 32px;
      width: 380px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      animation: scaleIn 0.2s;
    }

    @keyframes scaleIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .confirm-icon {
      margin-bottom: 16px;
    }

    h3 {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }

    .confirm-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .cancel-btn {
      padding: 10px 24px;
      background: #f1f5f9;
      color: #334155;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .cancel-btn:hover {
      background: #e2e8f0;
    }

    .delete-btn {
      padding: 10px 24px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .delete-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    }
  `]
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  visible = false;
  message = '';
  private onConfirmFn: (() => void) | null = null;
  private sub!: Subscription;

  constructor(private toast: ToastService) {}

  ngOnInit() {
    this.sub = this.toast.confirm$.subscribe((data: ConfirmDialog) => {
      this.message = data.message;
      this.onConfirmFn = data.onConfirm;
      this.visible = true;
    });
  }

  confirmAction() {
    if (this.onConfirmFn) this.onConfirmFn();
    this.visible = false;
  }

  cancel() {
    this.visible = false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
