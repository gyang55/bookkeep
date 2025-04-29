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
          <Text style={styles.monthTitle}>{monthName} {item.year}</Text>
          <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.categoriesContainer}>
          {Object.entries(item.categories).slice(0, 3).map(([category, amount]) => (
            <Text key={category} style={styles.categoryItem}>
              {category}: ${amount.toFixed(2)}
            </Text>
          ))}
          {Object.keys(item.categories).length > 3 && (
            <Text style={styles.moreCategories}>
              +{Object.keys(item.categories).length - 3} more
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Expenses</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#27ae60" />
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      ) : monthlySummaries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No expenses recorded yet.</Text>
          <TouchableOpacity 
            style={styles.addFirstButton}
            onPress={() => navigation.navigate('AddExpense')}
          >
            <Text style={styles.addFirstButtonText}>Add Your First Expense</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={monthlySummaries}
          renderItem={renderMonthItem}
          keyExtractor={(item) => `${item.year}-${item.month}`}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  addFirstButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  monthItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  moreCategories: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 4,
  },
});

export default HomeScreen;