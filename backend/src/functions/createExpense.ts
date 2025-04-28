// src/functions/createExpense.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from '../models/Expense';

const dynamoDb = new DynamoDB.DocumentClient();
const EXPENSES_TABLE = process.env.EXPENSES_TABLE || '';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const requestBody = JSON.parse(event.body);
    const { category, amount, description, date } = requestBody;

    // Validate required fields
    if (!category || !amount || !date) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Category, amount, and date are required' })
      };
    }

    // Get user ID from Cognito authenticated user
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }

    // Format date to extract year and month
    const expenseDate = new Date(date);
    const yearMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;

    // Create expense item
    const timestamp = new Date().getTime();
    const expense: Expense = {
      id: uuidv4(),
      userId,
      category,
      amount: Number(amount),
      description: description || '',
      date,
      yearMonth,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Save to DynamoDB
    await dynamoDb.put({
      TableName: EXPENSES_TABLE,
      Item: expense
    }).promise();

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(expense)
    };
  } catch (error) {
    console.error('Error creating expense:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Error creating expense' })
    };
  }
};