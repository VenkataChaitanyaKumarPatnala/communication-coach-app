import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  otp = '';

  showOtpForm = false;

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    const userData = { name: this.name, email: this.email, password: this.password };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.showOtpForm = true;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        console.error(err);
      },
    });
  }

  onVerifyOtp(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: (response) => {
        this.successMessage = 'Verification successful! Redirecting to dashboard...';
        localStorage.setItem('token', response.token);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'OTP verification failed.';
        console.error(err);
      },
    });
  }
}