interface UserResponse {
  username: string;
  imageUrl: string;
}

enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
}

interface MessageResponse {
  text: string;
  from: string;
  dateTime: string;
  status: MessageStatus;
  id: number;
}

interface ChatResponse {
  id: number;
  participants: UserResponse[];
  lastMessage: MessageResponse;
  unreadCount: number;
}

interface ChatConversationResponse {
  id: number;
  participants: UserResponse[];
  messages: MessageResponse[];
}

interface NewMessageNotification {
  text: string;
  from: string;
  dateTime: string;
  status: MessageStatus;
  id: number;
  chatId: number;
}
