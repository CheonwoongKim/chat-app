export interface Conversation {
  id: number;
  user_email: string;
  agent_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  sources: any[] | null;
  created_at: string;
}
