export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  roleId?: number;
  age?: number;
  grade?: string;
  phone?: string;
  parentId?: number;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
  roleId: number;
  avatarUrl: string | null;
  isActive: boolean;
  permissions: string[];
}
