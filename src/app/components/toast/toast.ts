import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent implements OnInit, OnDestroy {

  toasts: (Toast & { id: number })[] = [];
  private sub!: Subscription;
  private counter = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toast$.subscribe(toast => {
      const id = ++this.counter;
      this.toasts.push({ ...toast, id });
      setTimeout(() => this.removeToast(id), 3500);
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
