export interface Channel {
  id: number;
  name: string;
  description: string | null;
  createdById: number;
  createdByName: string;
  createdAt: string;
}

export interface ChannelRequest {
  name: string;
  description?: string;
}
