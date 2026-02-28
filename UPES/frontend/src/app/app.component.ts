import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  template: `
    <div class="app">
      <header class="header" *ngIf="isLoggedIn()">
        <a routerLink="/channels" class="logo">Campus Chat</a>
        <div class="user">
          <span class="user-name">{{ currentUser()?.name }}</span>
          <button type="button" class="btn btn-ghost" (click)="logout()">Logout</button>
        </div>
      </header>
      <main class="main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app { min-height: 100vh; display: flex; flex-direction: column; }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
    }
    .logo {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--text-primary);
    }
    .user { display: flex; align-items: center; gap: 1rem; }
    .user-name { color: var(--text-secondary); font-size: 0.9rem; }
    .main { flex: 1; }
    .btn-ghost {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius);
      font-size: 0.9rem;
    }
    .btn-ghost:hover { color: var(--text-primary); background: var(--bg-tertiary); }
  `],
})
export class AppComponent {
  constructor(private auth: AuthService) {}

  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  currentUser() {
    return this.auth.getCurrentUser();
  }

  logout(): void {
    this.auth.logout();
  }
}
