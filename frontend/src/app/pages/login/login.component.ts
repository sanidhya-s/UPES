import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>Welcome back</h1>
        <p class="subtitle">Sign in to Campus Chat</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="you@upes.ac.in" />
            <span class="error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Valid email required</span>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" placeholder="••••••••" />
            <span class="error" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Password required</span>
          </div>
          <p class="error" *ngIf="error">{{ error }}</p>
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="footer">Don't have an account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 2rem;
    }
    h1 { margin: 0 0 0.25rem; font-size: 1.75rem; }
    .subtitle { color: var(--text-secondary); margin: 0 0 1.5rem; font-size: 0.95rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label {
      display: block;
      margin-bottom: 0.35rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .form-group input {
      width: 100%;
      padding: 0.65rem 0.9rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text-primary);
      font-size: 1rem;
    }
    .form-group input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent-muted);
    }
    .error { color: var(--error); font-size: 0.85rem; margin-top: 0.25rem; display: block; }
    .btn {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: var(--radius);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    .btn-primary { background: var(--accent); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .footer { margin-top: 1.5rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem; }
  `],
})
export class LoginComponent {
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/channels']),
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Login failed. Please try again.';
      },
    });
  }
}
