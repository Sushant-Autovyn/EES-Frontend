import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('employee-frontend');
}
