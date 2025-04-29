import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Expense, ExpenseState, CategorySummary, MonthSummary, YearSummary } from '../types';
import { expensesApi } from '../api/client';
import { useAuth } from './authContext';

type ExpenseAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Expense[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

const ExpenseContext = createContext<{
  state: ExpenseState;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearError: () => void;
  getSummaries: () => {
    byCategory: CategorySummary;
    byYearAndMonth: YearSummary;
    total: number;
  };
}>({
  state: initialState,
  fetchExpenses: async () => {},
  addExpense: async () => {},
  updateExpense: async () => {},
  deleteExpense: async () => {},
  clearError: () => {},
  getSummaries: () => ({ byCategory: {}, byYearAndMonth: {}, total: 0 }),
});

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        expenses: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const { state: authState } = useAuth();

  // Fetch expenses when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchExpenses();
    }
  }, [authState.isAuthenticated]);

  const fetchExpenses = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const expenses = await expensesApi.getAll();
      dispatch({ type: 'FETCH_SUCCESS', payload: expenses });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch expenses' 
      });
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newExpense = await expensesApi.create(expense);
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to add expense' 
      });
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
      const updatedExpense = await expensesApi.update(id, expense);
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to update expense' 
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expensesApi.delete(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to delete expense' 
      });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Calculate summaries from the expenses
  const getSummaries = () => {
    const byCategory: CategorySummary = {};
    const byYearAndMonth: YearSummary = {};
    let total = 0;

    state.expenses.forEach(expense => {
      const amount = expense.amount;
      const category = expense.category;
      const date = new Date(expense.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const yearMonth = `${year}-${month}`;

      // Add to total
      total += amount;

      // Add to category summary
      byCategory[category] = (byCategory[category] || 0) + amount;

      // Add to year and month summary
      if (!byYearAndMonth[year]) {
        byYearAndMonth[year] = {};
      }
      
      if (!byYearAndMonth[year][month]) {
        byYearAndMonth[year][month] = {};
      }
      
      byYearAndMonth[year][month][category] = 
        (byYearAndMonth[year][month][category] || 0) + amount;
    });

    return {
      byCategory,
      byYearAndMonth,
      total,
    };
  };

  return (
    <ExpenseContext.Provider 
      value={{ 
        state, 
        fetchExpenses, 
        addExpense, 
        updateExpense, 
        deleteExpense, 
        clearError,
        getSummaries,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
