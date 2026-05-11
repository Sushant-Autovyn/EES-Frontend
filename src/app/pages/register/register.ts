import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  registerData = {
    name: '',
    email: '',
    password: '',
    role: 'employee'
  };

  confirmPassword = '';
  roles: any[] = [];

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/roles').subscribe({
      next: (res: any) => {
        this.roles = res;
      },
      error: () => {
        this.roles = [
          { role_name: 'admin' },
          { role_name: 'employee' },
          { role_name: 'hr' },
          { role_name: 'accountant' }
        ];
      }
    });
  }

  register() {
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
      this.toast.warning('Please fill all required fields');
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.toast.warning('Passwords do not match');
      return;
    }

    this.auth.register(this.registerData).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Registration Successful');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Registration failed');
      }
    });
  }
}
