import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConversationSummary } from '../../models/private-message.model';
import { DmService } from '../../services/dm.service';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, ReactiveFormsModule],
  template: `
    <div class="channels-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Channels</h2>
          <button type="button" class="btn btn-icon" (click)="showCreate = true" title="Create channel">+</button>
        </div>

        <nav class="nav-section">
          <span class="nav-label">My channels</span>
          <a *ngFor="let ch of myChannels" [routerLink]="['/channels', ch.id]" routerLinkActive="active" class="nav-link">
            # {{ ch.name }}
          </a>
          <p *ngIf="myChannels.length === 0 && !loading" class="empty">Join or create a channel</p>
        </nav>

        <nav class="nav-section">
          <span class="nav-label">All channels</span>
          <div *ngFor="let ch of allChannels" class="channel-row">
            <a [routerLink]="['/channels', ch.id]" routerLinkActive="active" class="nav-link"># {{ ch.name }}</a>
            <button *ngIf="!isInMyChannels(ch)" type="button" class="btn btn-sm" (click)="join(ch); $event.preventDefault()">Join</button>
          </div>
          <p *ngIf="allChannels.length === 0 && !loading" class="empty">No channels yet</p>
        </nav>

        <nav class="nav-section">
          <span class="nav-label">Direct messages</span>
          <a routerLink="/dm" class="nav-link">Message a user</a>
          <a *ngFor="let c of dmConversations" [routerLink]="['/dm', c.otherUserId]" class="nav-link dm-preview">
            {{ c.otherUserName }}
          </a>
        </nav>
      </aside>

      <div class="content">
        <div class="welcome" *ngIf="!createError">
          <h3>Welcome to Campus Chat</h3>
          <p>Select a channel from the sidebar or create one to start chatting.</p>
        </div>
      </div>
    </div>

    <div class="modal" *ngIf="showCreate" (click)="showCreate = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>Create channel</h3>
        <form [formGroup]="createForm" (ngSubmit)="createChannel()">
          <div class="form-group">
            <label>Name</label>
            <input formControlName="name" placeholder="e.g. general" />
          </div>
          <div class="form-group">
            <label>Description (optional)</label>
            <input formControlName="description" placeholder="What's this channel about?" />
          </div>
          <p class="error" *ngIf="createError">{{ createError }}</p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" (click)="showCreate = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="createForm.invalid || creating">Create</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .channels-layout { display: flex; min-height: calc(100vh - 52px); }
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
      width: 32px;
      height: 32px;
      border: none;
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border-radius: var(--radius);
      font-size: 1.25rem;
      cursor: pointer;
      line-height: 1;
    }
    .btn-icon:hover { background: var(--accent); }
    .nav-section { margin-bottom: 1.5rem; }
    .nav-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: block; }
    .nav-link {
      display: block;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius);
      color: var(--text-secondary);
      margin-bottom: 2px;
    }
    .nav-link:hover { background: var(--bg-tertiary); color: var(--text-primary); }
    .nav-link.active { background: var(--accent-muted); color: var(--accent); }
    .channel-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2px; }
    .channel-row .nav-link { flex: 1; }
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-sm:hover { background: var(--accent-hover); }
    .empty { color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0; padding: 0 0.75rem; }
    .dm-preview { font-size: 0.9rem; }
    .content { flex: 1; padding: 2rem; }
    .welcome { max-width: 480px; }
    .welcome h3 { margin: 0 0 0.5rem; }
    .welcome p { color: var(--text-secondary); margin: 0; }
    .modal {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal-content {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.5rem;
      width: 100%;
      max-width: 400px;
    }
    .modal-content h3 { margin: 0 0 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.35rem; font-size: 0.9rem; color: var(--text-secondary); }
    .form-group input {
      width: 100%;
      padding: 0.65rem 0.9rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text-primary);
    }
    .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: var(--radius); cursor: pointer; }
    .btn-ghost:hover { background: var(--bg-tertiary); }
    .btn-primary { background: var(--accent); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--radius); cursor: pointer; }
    .btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .error { color: var(--error); font-size: 0.85rem; margin: 0.5rem 0; }
  `],
})
export class ChannelsComponent implements OnInit {
  myChannels: Channel[] = [];
  allChannels: Channel[] = [];
  dmConversations: ConversationSummary[] = [];
  loading = false;
  showCreate = false;
  createError = '';
  creating = false;
  createForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor(
    private channelService: ChannelService,
    private dmService: DmService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.channelService.getMyChannels().subscribe({
      next: (ch) => { this.myChannels = ch; this.loading = false; },
      error: () => { this.loading = false; },
    });
    this.channelService.getAllChannels().subscribe({
      next: (ch) => this.allChannels = ch,
    });
    this.dmService.getConversations().subscribe({
      next: (c) => this.dmConversations = c,
    });
  }

  isInMyChannels(ch: Channel): boolean {
    return this.myChannels.some((c) => c.id === ch.id);
  }

  join(ch: Channel): void {
    this.channelService.joinChannel(ch.id).subscribe({
      next: () => this.load(),
    });
  }

  createChannel(): void {
    this.createError = '';
    this.creating = true;
    const { name, description } = this.createForm.getRawValue();
    this.channelService.createChannel({ name, description: description || undefined }).subscribe({
      next: () => {
        this.creating = false;
        this.showCreate = false;
        this.createForm.reset({ name: '', description: '' });
        this.load();
      },
      error: (err) => {
        this.creating = false;
        this.createError = err.error?.error || 'Failed to create channel';
      },
    });
  }
}
