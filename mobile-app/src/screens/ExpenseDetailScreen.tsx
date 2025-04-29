import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useExpenses } from '../store/expenseContext';
import { MaterialIcons } from '@expo/vector-icons';

type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;
type ExpenseDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExpenseDetail'>;

type Props = {
  route: ExpenseDetailScreenRouteProp;
  navigation: ExpenseDetailScreenNavigationProp;
};

const ExpenseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { expense } = route.params;
  const { deleteExpense } = useExpenses();
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteExpense(expense.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense. Please try again.');
              setLoading(false);
            }
          } 
        }
      ]
    );
  };

  const handleEdit = () => {
    // Navigate to edit screen (you could reuse the AddExpenseScreen with pre-filled data)
    navigation.navigate('AddExpense', { expense });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text style={styles.loadingText}>Deleting expense...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.category}>{expense.category}</Text>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="description" size={20} color="#7f8c8d" />
          <Text style={styles.description}>{expense.description}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="date-range" size={20} color="#7f8c8d" />
          <Text style={styles.detailText}>{formatDate(expense.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={20} color="#7f8c8d" />
          <Text style={styles.detailText}>
            Created: {new Date(expense.createdAt).toLocaleString()}
          </Text>
        </View>

        {expense.updatedAt !== expense.createdAt && (
          <View style={styles.detailRow}>
            <MaterialIcons name="update" size={20} color="#7f8c8d" />
            <Text style={styles.detailText}>
              Updated: {new Date(expense.updatedAt).toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={handleEdit}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <MaterialIcons name="delete" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  card: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
  },
  category: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 18,
    color: '#34495e',
    marginLeft: 10,
    flex: 1,
  },
  detailText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 10,
  },
  buttonContainer: {
    margin: 15,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#2980b9',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ExpenseDetailScreen;
