import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Expense {
  id: number;
  category: string;
  date: string;
  amount: number;
}

interface CategoryTotals {
  [category: string]: number;
}

interface CategoryEmojis {
  [category: string]: string;
}

const HomeScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, category: "Groceries", date: "2025-04-02", amount: 156.87 },
    { id: 2, category: "Utilities", date: "2025-04-05", amount: 210.45 },
    { id: 3, category: "Dining Out", date: "2025-04-10", amount: 78.5 },
    { id: 4, category: "Transportation", date: "2025-04-12", amount: 65.25 },
    { id: 5, category: "Entertainment", date: "2025-04-15", amount: 43.98 },
    { id: 6, category: "Groceries", date: "2025-04-18", amount: 143.72 },
    { id: 7, category: "Healthcare", date: "2025-04-20", amount: 125.0 },
    { id: 8, category: "Dining Out", date: "2025-04-23", amount: 92.3 },
  ]);
  const [activeTab, setActiveTab] = useState<"list" | "summary">("list");

  // Calculate totals
  const monthlyTotal: number = expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const categoryTotals: CategoryTotals = expenses.reduce(
    (acc: CategoryTotals, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = 0;
      }
      acc[exp.category] += exp.amount;
      return acc;
    },
    {}
  );

  const categoryEmojis: CategoryEmojis = {
    Groceries: "🛒",
    Utilities: "💡",
    "Dining Out": "🍽️",
    Transportation: "🚗",
    Entertainment: "🎬",
    Healthcare: "🏥",
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar barStyle="dark-content" />
      
      {/* iOS Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Family Budget</Text>
        <View style={styles.navIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="funnel-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Summary Card */}
      <View style={styles.cardContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryMonth}>April 2025</Text>
            <Text style={styles.summaryTotal}>${monthlyTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: "75%" }]} />
          </View>
          <View style={styles.summaryFooter}>
            <Text style={styles.summaryFooterText}>75% of budget</Text>
            <Text style={styles.summaryFooterText}>$1,200.00</Text>
          </View>
        </View>
      </View>

      {/* iOS Segmented Control */}
      <View style={styles.segmentedControlContainer}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === "list" && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab("list")}
          >
            <Text
              style={[
                styles.segmentButtonText,
                activeTab === "list" && styles.segmentButtonTextActive,
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === "summary" && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab("summary")}
          >
            <Text
              style={[
                styles.segmentButtonText,
                activeTab === "summary" && styles.segmentButtonTextActive,
              ]}
            >
              Summary
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar - iOS Style */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={16}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search expenses"
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInner}
      >
        {activeTab === "list" ? (
          <View style={styles.expensesList}>
            {expenses.map((expense) => (
              <TouchableOpacity key={expense.id} style={styles.expenseCard}>
                <View style={styles.expenseCardLeftContent}>
                  <View style={styles.expenseCardIcon}>
                    <Text style={styles.expenseCardEmoji}>
                      {categoryEmojis[expense.category] || "💰"}
                    </Text>
                  </View>
                  <View style={styles.expenseCardText}>
                    <Text style={styles.expenseCardCategory}>
                      {expense.category}
                    </Text>
                    <Text style={styles.expenseCardDate}>
                      {formatDate(expense.date)}
                    </Text>
                  </View>
                </View>
                <View style={styles.expenseCardRight}>
                  <Text style={styles.expenseCardAmount}>
                    ${expense.amount.toFixed(2)}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.summaryContainer}>
            <View style={styles.categoryBreakdownCard}>
              <Text style={styles.cardTitle}>Category Breakdown</Text>
              {Object.entries(categoryTotals).map(([category, total]) => (
                <View key={category} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryLabelContainer}>
                      <Text style={styles.categoryEmoji}>
                        {categoryEmojis[category] || "💰"}
                      </Text>
                      <Text style={styles.categoryLabel}>{category}</Text>
                    </View>
                    <Text style={styles.categoryTotal}>
                      ${total.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.categoryProgressBg}>
                    <View
                      style={[
                        styles.categoryProgress,
                        {
                          width: `${(total / monthlyTotal) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.totalCard}>
              <View style={styles.totalCardContent}>
                <Text style={styles.totalCardLabel}>Monthly Total</Text>
                <Text style={styles.totalCardAmount}>
                  ${monthlyTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* iOS Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarButton}>
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={[styles.tabBarLabel, styles.tabBarLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Ionicons name="bar-chart-outline" size={24} color="#999" />
          <Text style={styles.tabBarLabel}>Reports</Text>
        </TouchableOpacity>
        <View style={styles.tabBarMiddleButtonContainer}>
          <TouchableOpacity style={styles.tabBarMiddleButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.tabBarButton}>
          <Ionicons name="card-outline" size={24} color="#999" />
          <Text style={styles.tabBarLabel}>Cards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarButton}>
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.tabBarLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    backgroundColor: "#F5F5F5",
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  navIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryMonth: {
    color: "#666",
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#EBEBEB",
    borderRadius: 3,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  summaryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  summaryFooterText: {
    fontSize: 12,
    color: "#666",
  },
  segmentedControlContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#EBEBEB",
    borderRadius: 8,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  segmentButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  segmentButtonTextActive: {
    color: "#000",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBEBEB",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    padding: 0,
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
    paddingBottom: 100, // Extra padding at bottom for tab bar
  },
  expensesList: {
    gap: 12,
  },
  expenseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },
  expenseCardLeftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  expenseCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E1EFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  expenseCardEmoji: {
    fontSize: 18,
  },
  expenseCardText: {},
  expenseCardCategory: {
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 2,
  },
  expenseCardDate: {
    fontSize: 13,
    color: "#666",
  },
  expenseCardRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  expenseCardAmount: {
    fontWeight: "500",
    marginRight: 8,
  },
  summaryContainer: {
    gap: 16,
  },
  categoryBreakdownCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryEmoji: {
    marginRight: 8,
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
  },
  categoryTotal: {
    fontWeight: "500",
  },
  categoryProgressBg: {
    height: 8,
    backgroundColor: "#EBEBEB",
    borderRadius: 4,
    overflow: "hidden",
  },
  categoryProgress: {
    height: 8,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  totalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  totalCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalCardLabel: {
    fontWeight: "500",
  },
  totalCardAmount: {
    fontWeight: "700",
    fontSize: 18,
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 80,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: "#EBEBEB",
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  tabBarMiddleButtonContainer: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarMiddleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tabBarLabel: {
    fontSize: 10,
    marginTop: 2,
    color: "#999",
  },
  tabBarLabelActive: {
    color: "#007AFF",
  },
});

export default HomeScreen;