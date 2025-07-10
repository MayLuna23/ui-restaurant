export type ApiResponse = {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
};

export type User = {
  userId: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};