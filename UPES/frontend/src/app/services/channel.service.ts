import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel, ChannelRequest } from '../models/channel.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private readonly api = `${environment.apiUrl}/channels`;

  constructor(private http: HttpClient) {}

  getMyChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.api}/my`);
  }

  getAllChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(this.api);
  }

  getChannel(id: number): Observable<Channel> {
    return this.http.get<Channel>(`${this.api}/${id}`);
  }

  createChannel(data: ChannelRequest): Observable<Channel> {
    return this.http.post<Channel>(this.api, data);
  }

  joinChannel(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/join`, {});
  }

  leaveChannel(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/leave`, {});
  }
}
