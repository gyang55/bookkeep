// mobile-app/src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { format } from 'date-fns';
import { MonthlyExpenseSummary } from '../types/expense';

// Mock data for development - replace with actual API calls
const mockMonthlySummaries: MonthlyExpenseSummary[] = [
  {
    year: 2025,
    month: 4,
    totalAmount: 1250.75,
    categories: {
      'Groceries': 450.25,
      'Utilities': 320.50,
      'Entertainment': 150.00,
      'Transportation': 230.00,
      'Other': 100.00
    }
  },
  {
    year: 2025,
    month: 3,
    totalAmount: 1320.30,
    categories: {
      'Groceries': 480.30,
      'Utilities': 290.00,
      'Entertainment': 200.00,
      'Transportation': 250.00,
      'Other': 100.00
    }
  }
];

const HomeScreen = ({ navigation }: any) => {
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlyExpenseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch with timeout
    const timer = setTimeout(() => {
      setMonthlySummaries(mockMonthlySummaries);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
    
    /* Uncomment when API is ready
    const fetchMonthlySummaries = async () => {
      try {
        setLoading(true);
        const response = await API.get('expensesApi', '/expenses/summary/monthly', {});
        setMonthlySummaries(response);
      } catch (error) {
        console.error('Error fetching monthly summaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySummaries();
    */
  }, []);

  const renderMonthItem = ({ item }: { item: MonthlyExpenseSummary }) => {
    const monthName = format(new Date(item.year, item.month - 1, 1), 'MMMM');
    
    return (
      <TouchableOpacity 
        style={styles.monthItem}
        onPress={() => navigation.navigate('AddExpense')} // We'll replace this with MonthDetails when it's ready
      >
        <View style={styles.monthHeader}>
          <Text style={styles.mont