import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useExpenses } from '../store/expenseContext';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const ReportsScreen: React.FC = () => {
  const { state, getSummaries } = useExpenses();
  const summaries = getSummaries();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'category' | 'monthly'>('category');
  
  // Get available years and months
  const years = Object.keys(summaries.byYearAndMonth).sort((a, b) => b.localeCompare(a));
  
  // If no expenses yet, set default values
  if (years.length > 0 && !selectedYear) {
    setSelectedYear(years[0]);
  }

  // Get months for selected year
  const months = selectedYear ? Object.keys(summaries.byYearAndMonth[selectedYear]).sort() : [];
  
  // Format month name
  const getMonthName = (month: string) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[parseInt(month) - 1];
  };

  // Calculate totals for current selection
  const calculateTotals = () => {
    if (!selectedYear) return { byCategory: {}, total: 0 };

    let categoryTotals: Record<string, number> = {};
    let total = 0;

    if (selectedMonth) {
      // Get data for specific month
      categoryTotals = summaries.byYearAndMonth[selectedYear][selectedMonth] || {};
      total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    } else {
      // Get data for entire year
      const yearData = summaries.byYearAndMonth[selectedYear] || {};
      
      // Combine all categories for each month
      Object.keys(yearData).forEach(month => {
        const monthData = yearData[month];
        Object.entries(monthData).forEach(([category, amount]) => {
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
          total += amount;
        });
      });
    }

    return { byCategory: categoryTotals, total };
  };

  const totals = calculateTotals();

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Prepare data for chart
  const prepareChartData = () => {
    if (chartType === 'category') {
      // Category breakdown chart
      const categories = Object.keys(totals.byCategory);
      const amounts = Object.values(totals.byCategory);

      return {
        labels: categories.map(cat => cat.substring(0, 10)), // Truncate long category names
        datasets: [
          {
            data: amounts,
            colors: amounts.map((_, i) => {
              // Generate colors
              const colors = [
                '#27ae60', '#2980b9', '#8e44ad', '#f39c12', '#d35400',
                '#c0392b', '#16a085', '#2c3e50', '#f1c40f', '#e74c3c'
              ];
              return () => colors[i % colors.length];
            })
          }
        ]
      };
    } else {
      // Monthly trend chart
      if (!selectedYear) return { labels: [], datasets: [{ data: [] }] };

      const yearData = summaries.byYearAndMonth[selectedYear] || {};
      const monthNumbers = Object.keys(yearData).sort();
      const monthlyTotals = monthNumbers.map(month => {
        const categoryData = yearData[month];
        return Object.values(categoryData).reduce((sum, val) => sum + val, 0);
      });

      return {
        labels: monthNumbers.map(m => getMonthName(m).substring(0, 3)),
        datasets: [
          {
            data: monthlyTotals,
            color: () => '#27ae60', // Primary color
            strokeWidth: 2
          }
        ]
      };
    }
  };

  const chartData = prepareChartData();
  const screenWidth = Dimensions.get('window').width - 40;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Reports</Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Year</Text>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(value) => {
              setSelectedYear(value);
              setSelectedMonth(null);
            }}
            style={styles.picker}
          >
            {years.map(year => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Month</Text>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={setSelectedMonth}
            style={styles.picker}
          >
            <Picker.Item label="All Months" value={null} />
            {months.map(month => (
              <Picker.Item 
                key={month} 
                label={getMonthName(month)} 
                value={month} 
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>
          {selectedMonth 
            ? `${getMonthName(selectedMonth)} ${selectedYear}` 
            : `Year ${selectedYear}`}
        </Text>
        <Text style={styles.summaryTotal}>
          Total: {formatCurrency(totals.total)}
        </Text>
      </View>

      <View style={styles.chartTypeContainer}>
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            chartType === 'category' && styles.chartTypeButtonActive
          ]}
          onPress={() => setChartType('category')}
        >
          <Text 
            style={[
              styles.chartTypeText,
              chartType === 'category' && styles.chartTypeTextActive
            ]}
          >
            By Category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            chartType === 'monthly' && styles.chartTypeButtonActive
          ]}
          onPress={() => setChartType('monthly')}
        >
          <Text 
            style={[
              styles.chartTypeText,
              chartType === 'monthly' && styles.chartTypeTextActive
            ]}
          >
            Monthly Trend
          </Text>
        </TouchableOpacity>
      </View>

      {chartData.labels.length > 0 ? (
        <View style={styles.chartContainer}>
          {chartType === 'category' ? (
            <BarChart
              data={chartData}
              width={screenWidth}
              height={220}
              yAxisLabel="$"
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
              }}
              style={styles.chart}
              fromZero
            />
          ) : (
            <LineChart
              data={chartData}
              width={screenWidth}
              height={220}
              yAxisLabel="$"
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#27ae60"
                }
              }}
              bezier
              style={styles.chart}
              fromZero
            />
          )}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No data available for the selected period
          </Text>
        </View>
      )}

      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>Expense Breakdown</Text>
        {Object.entries(totals.byCategory).length > 0 ? (
          Object.entries(totals.byCategory)
            .sort(([, amountA], [, amountB]) => amountB - amountA)
            .map(([category, amount]) => {
              const percentage = (amount / totals.total) * 100;
              return (
                <View key={category} style={styles.breakdownItem}>
                  <View style={styles.breakdownItemHeader}>
                    <Text style={styles.breakdownCategory}>{category}</Text>
                    <Text style={styles.breakdownAmount}>
                      {formatCurrency(amount)}
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.breakdownPercentage}>
                    {percentage.toFixed(1)}%
                  </Text>
                </View>
              );
            })
        ) : (
          <Text style={styles.noDataText}>
            No data available for the selected period
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#27ae60',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filtersContainer: {
    flexDirection: 'row',
    margin: 15,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#34495e',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  summaryContainer: {
    margin: 15,
    marginTop: 0,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  chartTypeContainer: {
    flexDirection: 'row',
    margin: 15,
    marginBottom: 0,
  },
  chartTypeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  chartTypeButtonActive: {
    borderBottomColor: '#27ae60',
  },
  chartTypeText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  chartTypeTextActive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  chartContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  noDataContainer: {
    margin: 15,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noDataText: {
    color: '#7f8c8d',
    fontSize: 16,
    textAlign: 'center',
  },
  breakdownContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  breakdownItem: {
    marginBottom: 15,
  },
  breakdownItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  breakdownCategory: {
    fontSize: 14,
    color: '#34495e',
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#27ae60',
  },
  breakdownPercentage: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
});

export default ReportsScreen;
