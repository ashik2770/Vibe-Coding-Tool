export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  credits: number;
  plan: 'free' | 'premium';
  api_key_enabled: boolean;
  referral_code: string;
  referred_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  type: 'react-vite' | 'nextjs' | 'tailwind';
  code: string;
  files?: ProjectFile[];
  visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  author?: User;
  published_at: string;
  updated_at: string;
  seo_meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CreditUsage {
  id: string;
  user_id: string;
  project_id?: string;
  amount: number;
  type: 'ai_generation' | 'project_export' | 'other';
  description: string;
  created_at: string;
}

export interface APIKey {
  id: string;
  user_id: string;
  provider: 'openai' | 'anthropic';
  key_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RateLimit {
  id: string;
  ip: string;
  count: number;
  reset_at: string;
  created_at: string;
}

export interface IPBlock {
  id: string;
  ip: string;
  user_id?: string;
  reason: string;
  blocked_at: string;
  expires_at?: string;
}