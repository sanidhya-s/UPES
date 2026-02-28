import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'channels', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'channels',
    loadComponent: () => import('./pages/channels/channels.component').then(m => m.ChannelsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'channels/:id',
    loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dm',
    loadComponent: () => import('./pages/dm/dm.component').then(m => m.DmComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dm/:userId',
    loadComponent: () => import('./pages/dm-chat/dm-chat.component').then(m => m.DmChatComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'channels' },
];
