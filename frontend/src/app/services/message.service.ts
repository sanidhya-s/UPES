import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMessages(channelId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.api}/channels/${channelId}/messages`);
  }

  sendMessage(channelId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.api}/channels/${channelId}/messages`, { content });
  }
}
