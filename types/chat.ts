export interface Source {
  fileName: string;
  fileFormat: string;
  page: number;
  department: string;
  manager: string;
  url?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
}
