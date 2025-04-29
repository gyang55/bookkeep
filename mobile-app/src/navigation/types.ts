import { Expense } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AddExpense: undefined;
  ExpenseDetail: { expense: Expense };
  Reports: undefined;
};
