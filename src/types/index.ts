/**
 * Type definitions for the application
 */

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role?: string;
}

export interface AuthSession {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  weight?: number;
  active?: boolean;
  discount?: number;
  category_id: number;
  img_id?: string;
  ima_url?: string;
  created_at?: string;
  stock?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  img_url?: string;
  img_id?: string;
  created_at?: string;
}
