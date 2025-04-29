// mobile-app/src/types/expense.ts
export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExpenseFormData {
  category: string;
  amount: number;
  date: string;
  description?: string;
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
  count: number;
}

export interface MonthlyExpenseSummary {
  year: number;
  month: number;
  totalAmount: number;
  categories: {
    [category: string]: number;
  };
}

export interface YearlySummary {
  year: number;
  totalAmount: number;
  monthlyTotals: {
    [month: number]: number;
  };
}

export type ExpenseCategory = 
  | 'Groceries'
  | 'Dining'
  | 'Transportation'
  | 'Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Healthcare'
  | 'Education'
  | 'Housing'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Groceries',
  'Dining',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Housing',
  'Other'
];