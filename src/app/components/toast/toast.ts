import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
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

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.sub = this.toastService.toast$.subscribe(toast => {
      this.zone.run(() => {
        const id = ++this.counter;
        this.toasts.push({ ...toast, id });
        this.cdr.detectChanges();
        setTimeout(() => this.removeToast(id), 3500);
      });
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
