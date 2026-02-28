import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DmService } from '../../services/dm.service';
import { UserService } from '../../services/user.service';
import { ConversationSummary } from '../../models/private-message.model';
import { UserSummary } from '../../models/user.model';

@Component({
  selector: 'app-dm',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  template: `
    <div class="dm-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Direct messages</h2>
          <button type="button" class="btn btn-icon" (click)="openNewMessageModal()" title="New message">+</button>
        </div>
        <a routerLink="/channels" class="nav-link">← Channels</a>
        <nav class="nav-section">
          <span class="nav-label">Conversations</span>
          <a *ngFor="let c of conversations" [routerLink]="['/dm', c.otherUserId]" class="nav-link dm-link">
            <span class="dm-name">{{ c.otherUserName }}</span>
            <span class="dm-preview">{{ c.lastMessagePreview }}</span>
          </a>
          <p *ngIf="conversations.length === 0 && !loading" class="empty">No conversations yet. Message a user to start.</p>
        </nav>
      </aside>

      <div class="content">
        <div class="welcome">
          <h3>Direct messages</h3>
          <p>Select a conversation from the sidebar or start a new message.</p>
        </div>
      </div>
    </div>

    <div class="modal" *ngIf="showNewMessage" (click)="showNewMessage = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>Message a user</h3>
        <div class="user-list">
          <button *ngFor="let u of users" type="button" class="user-item" (click)="openChat(u)">
            <span class="user-name">{{ u.name }}</span>
            <span class="user-email">{{ u.email }}</span>
          </button>
        </div>
        <p *ngIf="users.length === 0 && !usersLoading" class="empty">No other users yet.</p>
        <p *ngIf="usersLoading" class="empty">Loading...</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" (click)="showNewMessage = false">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dm-layout { display: flex; min-height: calc(100vh - 52px); }
    .sidebar {
      width: 280px;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      padding: 1rem;
      overflow-y: auto;
    }
    .sidebar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .sidebar-header h2 { margin: 0; font-size: 1.1rem; }
    .btn-icon {
      width: 32px; height: 32px; border: none; background: var(--bg-tertiary);
      color: var(--text-primary); border-radius: var(--radius); font-size: 1.25rem; cursor: pointer; line-height: 1;
    }
    .btn-icon:hover { background: var(--accent); }
    .nav-section { margin-bottom: 1rem; }
    .nav-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: block; }
    .nav-link {
      display: block; padding: 0.5rem 0.75rem; border-radius: var(--radius);
      color: var(--text-secondary); margin-bottom: 2px;
    }
    .nav-link:hover { background: var(--bg-tertiary); color: var(--text-primary); }
    .dm-link { display: flex; flex-direction: column; gap: 0.15rem; }
    .dm-name { font-weight: 500; color: var(--text-primary); }
    .dm-preview { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .empty { color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0; padding: 0 0.75rem; }
    .content { flex: 1; padding: 2rem; }
    .welcome h3 { margin: 0 0 0.5rem; }
    .welcome p { color: var(--text-secondary); margin: 0; }
    .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal-content { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; width: 100%; max-width: 400px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; }
    .modal-content h3 { margin: 0 0 1rem; }
    .user-list { overflow-y: auto; flex: 1; margin-bottom: 1rem; }
    .user-item {
      display: block; width: 100%; text-align: left; padding: 0.75rem; border: none; background: var(--bg-tertiary);
      border-radius: var(--radius); color: var(--text-primary); cursor: pointer; margin-bottom: 0.5rem;
    }
    .user-item:hover { background: var(--accent-muted); }
    .user-name { display: block; font-weight: 500; }
    .user-email { font-size: 0.85rem; color: var(--text-muted); }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: var(--radius); cursor: pointer; }
    .btn-ghost:hover { background: var(--bg-tertiary); }
  `],
})
export class DmComponent implements OnInit {
  conversations: ConversationSummary[] = [];
  users: UserSummary[] = [];
  loading = false;
  usersLoading = false;
  showNewMessage = false;

  constructor(
    private dmService: DmService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.loading = true;
    this.dmService.getConversations().subscribe({
      next: (c) => { this.conversations = c; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  openNewMessageModal(): void {
    this.showNewMessage = true;
    this.usersLoading = true;
    this.userService.getUsers().subscribe({
      next: (u) => { this.users = u; this.usersLoading = false; },
      error: () => { this.usersLoading = false; },
    });
  }

  openChat(user: UserSummary): void {
    this.showNewMessage = false;
    this.router.navigate(['/dm', user.id]);
  }
}
