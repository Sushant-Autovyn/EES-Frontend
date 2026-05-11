import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  id?: number;
}

export interface ConfirmDialog {
  message: string;
  onConfirm: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  private confirmSubject = new Subject<ConfirmDialog>();
  confirm$ = this.confirmSubject.asObservable();

  success(message: string) {
    this.toastSubject.next({ message, type: 'success' });
  }

  error(message: string) {
    this.toastSubject.next({ message, type: 'error' });
  }

  warning(message: string) {
    this.toastSubject.next({ message, type: 'warning' });
  }

  info(message: string) {
    this.toastSubject.next({ message, type: 'info' });
  }

  confirm(message: string, onConfirm: () => void) {
    this.confirmSubject.next({ message, onConfirm });
  }
}
