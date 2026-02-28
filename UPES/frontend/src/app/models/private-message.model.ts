export interface PrivateMessage {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  createdAt: string;
}

export interface ConversationSummary {
  otherUserId: number;
  otherUserName: string;
  lastMessagePreview: string;
  lastMessageAt: string;
}
