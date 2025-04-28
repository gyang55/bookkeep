// src/functions/listExpenses.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Expense, ExpenseSummary, CategorySummary } from '../models/Expense';

const dynamoDb = new DynamoDB.DocumentClient();
const EXPENSES_TABLE = process.env.EXPENSES_TABLE || '';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get user ID from Cognito authenticated user
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }

    // Parse query parameters
    const { year, month, category, groupBy } = event.queryStringParameters || {};

    // Base params for querying
    let params: DynamoDB.DocumentClient.ScanInput = {
      TableName: EXPENSES_TABLE,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    // Add filters if provided
    if (year && month) {
      const yearMonth = `${year}-${month.padStart(2, '0')}`;
      params = {
        TableName: EXPENSES_TABLE,
        IndexName: 'yearMonth-index',
        KeyConditionExpression: 'yearMonth = :yearMonth',
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':yearMonth': yearMonth,
          ':userId': userId
        }
      } as DynamoDB.DocumentClient.QueryInput;
    }
    
    if (category) {
      params = {
        TableName: EXPENSES_TABLE,
        IndexName: 'category-index',
        KeyConditionExpression: 'category = :category',
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':category': category,
          ':userId': userId
        }
      } as DynamoDB.DocumentClient.QueryInput;
    }

    // Execute query
    const result = 'KeyConditionExpression' in params 
      ? await dynamoDb.query(params as DynamoDB.DocumentClient.QueryInput).promise()
      : await dynamoDb.scan(params).promise();
    
    const expenses = result.Items as Expense[];

    // Process based on groupBy parameter
    if (groupBy === 'month') {
      // Group by year-month
      const monthlySummary: Record<string, ExpenseSummary> = {};
      
      expenses.forEach(expense => {
        if (!monthlySummary[expense.yearMonth]) {
          monthlySummary[expense.yearMonth] = {
            yearMonth: expense.yearMonth,
            totalAmount: 0,
            categories: {}
          };
        }
        
        monthlySummary[expense.yearMonth].totalAmount += expense.amount;
        
        if (!monthlySummary[expense.yearMonth].categories[expense.category]) {
          monthlySummary[expense.yearMonth].categories[expense.category] = 0;
        }
        
        monthlySummary[expense.yearMonth].categories[expense.category] += expense.amount;
      });
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(Object.values(monthlySummary))
      };
    } else if (groupBy === 'category') {
      // Group by category
      const categorySummary: Record<string, CategorySummary> = {};
      
      expenses.forEach(expense => {
        if (!categorySummary[expense.category]) {
          categorySummary[expense.category] = {
            category: expense.category,
            totalAmount: 0,
            months: {}
          };
        }
        
        categorySummary[expense.category].totalAmount += expense.amount;
        
        if (!categorySummary[expense.category].months[expense.yearMonth]) {
          categorySummary[expense.category].months[expense.yearMonth] = 0;
        }
        
        categorySummary[expense.category].months[expense.yearMonth] += expense.amount;
      });
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(Object.values(categorySummary))
      };
    } else {
      // Return raw expenses
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(expenses)
      };
    }
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Error fetching expenses' })
    };
  }
};