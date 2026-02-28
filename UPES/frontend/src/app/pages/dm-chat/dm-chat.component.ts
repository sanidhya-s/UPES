import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, interval, switchMap, takeUntil } from 'rxjs';
import { DmService } from '../../services/dm.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ConversationSummary } from '../../models/private-message.model';
import { PrivateMessage } from '../../models/private-message.model';
import { UserSummary } from '../../models/user.model';

@Component({
  selector: 'app-dm-chat',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, ReactiveFormsModule],
  template: `
    <div class="chat-layout">
      <aside class="sidebar">
        <div class="sidebar-header"><h2>Channels</h2></div>
        <a routerLink="/channels" class="nav-link"># Channels</a>
        <div class="sidebar-header"><h2>Direct messages</h2></div>
        <a routerLink="/dm" class="nav-link">All DMs</a>
        <a *ngFor="let c of conversations" [routerLink]="['/dm', c.otherUserId]" [class.active]="c.otherUserId === otherUserId" class="nav-link">
          {{ c.otherUserName }}
        </a>

      </aside>

      <div class="chat-main" *ngIf="otherUser">
        <header class="chat-header">
          <a routerLink="/dm" class="back">← Direct messages</a>
          <h1>Private chat with {{ otherUser.name }}</h1>
        </header>

        <div class="messages">
          <div *ngFor="let msg of messages" class="message" [class.sent]="isSent(msg)">
            <span class="sender">{{ msg.senderName }}</span>
            <span class="time">{{ formatTime(msg.createdAt) }}</span>
            <p class="content">{{ msg.content }}</p>
          </div>
          <p *ngIf="messages.length === 0 && !loading" class="empty">No messages yet. Say hello!</p>
          <p *ngIf="loading" class="empty">Loading...</p>
        </div>

        <form class="input-row" [formGroup]="form" (ngSubmit)="send()">
          <input formControlName="content" placeholder="Type a message..." />
          <button type="submit" class="btn-send" [disabled]="form.invalid || sending">Send</button>
        </form>
      </div>

      <div class="chat-main error" *ngIf="error && !otherUser">
        <p>{{ error }}</p>
        <a routerLink="/dm">Back to DMs</a>
      </div>
    </div>
  `,
  styles: [`
    .chat-layout { display: flex; min-height: calc(100vh - 52px); }
    .sidebar {
      width: 260px;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      padding: 1rem;
    }
    .sidebar-header { margin-top: 0.75rem; margin-bottom: 0.5rem; }
    .sidebar-header:first-child { margin-top: 0; }
    .sidebar-header h2 { margin: 0; font-size: 1rem; color: var(--text-muted); }
    .nav-link {
      display: block; padding: 0.5rem 0.75rem; border-radius: var(--radius);
      color: var(--text-secondary); margin-bottom: 2px;
    }
    .nav-link:hover { background: var(--bg-tertiary); color: var(--text-primary); }
    .nav-link.active { background: var(--accent-muted); color: var(--accent); }
    .chat-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .chat-main.error { padding: 2rem; color: var(--error); }
    .chat-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); background: var(--bg-secondary); }
    .back { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.25rem; display: inline-block; }
    .back:hover { color: var(--accent); }
    .chat-header h1 { margin: 0; font-size: 1.25rem; }
    .messages {
      flex: 1; overflow-y: auto; padding: 1rem 1.5rem;
      display: flex; flex-direction: column; gap: 1rem;
    }
    .message { max-width: 70%; padding: 0.5rem 0; }
    .message.sent .sender { color: var(--accent); }
    .message .sender { font-weight: 600; font-size: 0.9rem; margin-right: 0.5rem; }
    .message .time { font-size: 0.75rem; color: var(--text-muted); }
    .message .content { margin: 0.25rem 0 0; color: var(--text-primary); white-space: pre-wrap; word-break: break-word; }
    .empty { color: var(--text-muted); margin: 1rem 0; }
    .input-row {
      display: flex; gap: 0.75rem; padding: 1rem 1.5rem;
      border-top: 1px solid var(--border); background: var(--bg-secondary);
    }
    .input-row input {
      flex: 1; padding: 0.75rem 1rem; background: var(--bg-tertiary);
      border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-primary); font-size: 1rem;
    }
    .input-row input:focus { outline: none; border-color: var(--accent); }
    .btn-send {
      padding: 0.75rem 1.25rem; background: var(--accent); color: white; border: none;
      border-radius: var(--radius); font-weight: 600; cursor: pointer;
    }
    .btn-send:hover:not(:disabled) { background: var(--accent-hover); }
    .btn-send:disabled { opacity: 0.6; cursor: not-allowed; }
  `],
})
export class DmChatComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private dmService = inject(DmService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  otherUserId: number | null = null;
  otherUser: UserSummary | null = null;
  conversations: ConversationSummary[] = [];
  messages: PrivateMessage[] = [];
  loading = false;
  error = '';
  sending = false;
  form = this.fb.nonNullable.group({
    content: ['', Validators.required],
  });

  ngOnInit(): void {
    this.dmService.getConversations().subscribe((c) => (this.conversations = c));

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const userId = params.get('userId');
      if (userId) {
        this.otherUserId = +userId;
        this.loadOtherUser();
        this.loadMessages();
        this.startPolling();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOtherUser(): void {
    if (!this.otherUserId) return;
    this.userService.getUser(this.otherUserId).subscribe({
      next: (u) => (this.otherUser = u),
      error: () => (this.otherUser = { id: this.otherUserId!, name: 'User', email: '' }),
    });
  }

  private loadMessages(): void {
    if (!this.otherUserId) return;
    this.loading = true;
    this.dmService.getMessagesWith(this.otherUserId).subscribe({
      next: (list) => {
        this.messages = list;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  private startPolling(): void {
    if (!this.otherUserId) return;
    interval(4000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.dmService.getMessagesWith(this.otherUserId!)),
      )
      .subscribe((list) => (this.messages = list));
  }

  isSent(msg: PrivateMessage): boolean {
    const me = this.authService.getCurrentUser()?.userId ?? null;
    return me !== null && msg.senderId === me;
  }

  send(): void {
    if (!this.otherUserId || this.form.invalid) return;
    const content = this.form.getRawValue().content;
    this.form.reset({ content: '' });
    this.sending = true;
    this.dmService.sendMessage(this.otherUserId, content).subscribe({
      next: (msg) => {
        this.messages = [...this.messages, msg];
        this.sending = false;
      },
      error: () => (this.sending = false),
    });
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleString();
  }
}
