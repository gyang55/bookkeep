export interface Expense {
    id: string;
    userId: string;
    category: string;
    amount: number;
    description: string;
    date: string;
    yearMonth: string; // Format: YYYY-MM (for easy querying)
    createdAt: number;
    updatedAt: number;
  }
  
  export interface ExpenseSummary {
    yearMonth: string;
    totalAmount: number;
    categories: {
      [category: string]: number;
    };
  }
  
  export interface CategorySummary {
    category: string;
    totalAmount: number;
    months: {
      [yearMonth: string]: number;
    };
  }