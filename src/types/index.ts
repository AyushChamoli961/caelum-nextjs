import {
  User,
  Blog,
  SeoPage,
  AdminUser,
  Chat,
  MonicaChat,
  UserType,
  UserRole,
} from "@prisma/client";

// Re-export Prisma types
export type { User, Blog, SeoPage, AdminUser, Chat, MonicaChat };
export { UserType, UserRole };

// API Response types
export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  displayMessage?: string;
  result?: T;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  admin: Omit<AdminUser, "passwordHash">;
  token: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  userType: UserType;
}

export interface AdminJWTPayload {
  adminId: string;
  email: string;
  role: string;
}

// Blog types
export interface CreateBlogRequest {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  content?: string;
  image?: string;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {}

// SEO types
export interface CreateSeoPageRequest {
  slug: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  isActive?: boolean;
}

export interface UpdateSeoPageRequest extends Partial<CreateSeoPageRequest> {}

// Chat types
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CreateChatRequest {
  sessionId: string;
  userMessage: string;
}

export interface ChatResponse {
  sessionId: string;
  userMessage: string;
  botResponse: string;
}

// Feasibility Calculator types
export interface FeasibilityRequest {
  landSize: number;
  category: string;
}

export interface FeasibilityResponse {
  landSize: number;
  potentialBuiltUp: number;
  computedValue: number;
  category: string;
}

// Revenue Calculator types
export interface RevenueRequest {
  noofStudents: number;
  potentialBuiltUp?: number;
}

export interface RevenueResponse {
  noofStudents: number;
  potentialBuiltUp?: number;
  realisedRevenuePotential: number;
}

// Component Props types
export interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

// Dashboard types
export interface DashboardStats {
  totalChats: number;
  totalCalculations: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "chat" | "calculation" | "login";
  description: string;
  timestamp: Date;
}

// Learning Resources types
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  pdfUrl?: string;
  videoUrl?: string;
}

export interface LearningCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  resources: LearningResource[];
}
