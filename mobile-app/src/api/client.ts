import { Expense, User } from '../types';

// Replace with your actual API URL once deployed
const API_URL = 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any
): Promise<T> {
  const token = await getAuthToken();
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  
  return response.json();
}

// Get authentication token from secure storage
async function getAuthToken(): Promise<string> {
  // Implementation will depend on your auth storage method
  // This is a placeholder
  return 'your-auth-token';
}

// Auth API
export const authApi = {
  login: (username: string, password: string) => 
    apiRequest<{ user: User; token: string }>('/auth/login', 'POST', { username, password }),
  
  logout: () => apiRequest<{ success: boolean }>('/auth/logout', 'POST'),
  
  getCurrentUser: () => apiRequest<User>('/auth/me'),
};

// Expenses API
export const expensesApi = {
  getAll: () => apiRequest<Expense[]>('/expenses'),
  
  create: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => 
    apiRequest<Expense>('/expenses', 'POST', expense),
  
  update: (id: string, expense: Partial<Expense>) => 
    apiRequest<Expense>(`/expenses/${id}`, 'PUT', expense),
  
  delete: (id: string) => 
    apiRequest<{ success: boolean }>(`/expenses/${id}`, 'DELETE'),
  
  getSummary: (year?: number, month?: number) => {
    let endpoint = '/expenses/summary';
    if (year) {
      endpoint += `?year=${year}`;
      if (month) {
        endpoint += `&month=${month}`;
      }
    }
    return apiRequest<{
      byCategory: Record<string, number>;
      byMonth: Record<string, number>;
      total: number;
    }>(endpoint);
  },
};
