import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrivateMessage, ConversationSummary } from '../models/private-message.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DmService {
  private readonly api = `${environment.apiUrl}/dm`;

  constructor(private http: HttpClient) {}

  getConversations(): Observable<ConversationSummary[]> {
    return this.http.get<ConversationSummary[]>(`${this.api}/conversations`);
  }

  getMessagesWith(userId: number): Observable<PrivateMessage[]> {
    return this.http.get<PrivateMessage[]>(`${this.api}/conversations/${userId}/messages`);
  }

  sendMessage(recipientId: number, content: string): Observable<PrivateMessage> {
    return this.http.post<PrivateMessage>(`${this.api}/messages`, { recipientId, content });
  }
}
