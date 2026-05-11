import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  loginData = {
    email: '',
    password: ''
  };

  forgotMode = false;
  otpMode = false;
  forgotEmail = '';
  otp = '';
  newPassword = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private toast: ToastService,
    private http: HttpClient
  ) {}

login(){
  this.auth.login(this.loginData)
  .subscribe((res:any)=>{
    localStorage.setItem('token', res.token);
    // Fetch and cache permissions before navigating
    this.http.get<{ permissions: string[] }>('https://ees-backend-production.up.railway.app/api/roles/my-permissions', {
      headers: { Authorization: `Bearer ${res.token}` }
    }).subscribe({
      next: (permRes) => {
        localStorage.setItem('userPermissions', JSON.stringify(permRes.permissions || []));
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  });
}

sendOtp(){
  this.auth.forgotPassword(this.forgotEmail)
  .subscribe({
    next: (res:any) => {
      if (res.otp) {
        this.toast.info('Email not configured. Your OTP is: ' + res.otp);
      } else {
        this.toast.success('OTP sent to your email');
      }
      this.otpMode = true;
    },
    error: (err:any) => {
      this.toast.error(err.error?.message || 'Failed to send OTP');
    }
  });
}

resetPassword(){
  this.auth.resetPassword({email:this.forgotEmail, otp:this.otp, newPassword:this.newPassword})
  .subscribe({
    next: (res:any) => {
      this.toast.success('Password reset successful');
      this.forgotMode = false;
      this.otpMode = false;
    },
    error: (err:any) => {
      this.toast.error(err.error?.message || 'Password reset failed');
    }
  });
}

}