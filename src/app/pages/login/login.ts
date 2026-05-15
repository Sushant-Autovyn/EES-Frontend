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
  forgotPhone = '';
  otpChannel: 'whatsapp' | 'sms' = 'whatsapp';
  otp = '';
  newPassword = '';
  sendingOtp = false;
  resetting = false;

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

openForgot(){
  this.forgotMode = true;
  this.otpMode = false;
  this.forgotPhone = '';
  this.otp = '';
  this.newPassword = '';
}

closeForgot(){
  this.forgotMode = false;
  this.otpMode = false;
}

sendOtp(){
  if (this.sendingOtp) return;
  if (!this.forgotPhone) {
    this.toast.warning('Please enter your phone number');
    return;
  }
  this.sendingOtp = true;
  this.auth.forgotPassword(this.forgotPhone, this.otpChannel)
  .subscribe({
    next: (res:any) => {
      this.otpMode = true;
      this.sendingOtp = false;
      if (res.devMode && res.otp) {
        this.toast.info((this.otpChannel === 'whatsapp' ? 'WhatsApp' : 'SMS') + ' not configured. Your OTP: ' + res.otp);
      } else {
        this.toast.success('OTP sent to your phone via ' + (this.otpChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'));
      }
    },
    error: (err:any) => {
      this.sendingOtp = false;
      this.toast.error(err.error?.message || 'Failed to send OTP');
    }
  });
}

resetPassword(){
  if (this.resetting) return;
  if (!this.otp || !this.newPassword) {
    this.toast.warning('Enter OTP and new password');
    return;
  }
  this.resetting = true;
  this.auth.resetPassword({ phone: this.forgotPhone, otp: this.otp, newPassword: this.newPassword })
  .subscribe({
    next: (res:any) => {
      this.forgotMode = false;
      this.otpMode = false;
      this.resetting = false;
      this.toast.success('Password reset successful');
    },
    error: (err:any) => {
      this.resetting = false;
      this.toast.error(err.error?.message || 'Password reset failed');
    }
  });
}

}