import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Query {
    login(email: String, password: String): Boolean
    user: User
    budgets(budgetId: ID, userId: ID): [Budget]
    transactions(transactionId: ID): [Transaction]
    cycleTransactions(cycleTransactionId: ID): [CycleTransaction]
    categories(categoryId: ID): [Category]
    bankAccounts(bankAccountId: ID): [BankAccount]
    merchants(merchantId: ID): [Merchant]
    debts(debtId: ID): [Debt]
    notifications(notificationId: ID): [Notification]
  }

  type Mutation {
    createBankAccount(
      name: String!
      currency: String!
      category: ID
      description: String
    ): BankAccount
    updateBankAccount(
      bankAccountId: ID!
      name: String
      currency: String
      category: ID
      description: String
      balance: Float
    ): BankAccount
    deleteBankAccount(bankAccountId: ID!): BankAccount

    createBudget(name: String!): Budget
    updateBudget(budgetId: ID!, name: String): Budget
    deleteBudget(budgetId: ID!): Budget
    addBudgetRole(userId: ID!, budgetId: ID!, role: BudgetRole!): Budget
    removeBudgetRole(userId: ID!, budgetId: ID!, role: BudgetRole!): Budget

    createCategory(
      name: String!
      type: CategoryType!
      icon: String!
      color: String!
    ): Category
    updateCategory(
      categoryId: ID!
      name: String
      type: CategoryType
      icon: String
      color: String
    ): Category
    deleteCategory(categoryId: ID!): Category

    createCycleTransaction(
      name: String!
      price: Float
      period: String!
      description: String
      category: ID
      budget: ID
      merchant: ID
      payer: ID
      beneficiary: ID
    ): CycleTransaction
    updateCycleTransaction(
      cycleTransactionId: ID!
      name: String
      price: Float
      period: String
      lastPayment: String
      description: String
      category: ID
      budget: ID
      merchant: ID
      payer: ID
      beneficiary: ID
    ): CycleTransaction
    deleteCycleTransaction(cycleTransactionId: ID!): CycleTransaction

    createDebt(
      name: String!
      currency: String!
      interestRate: Float!
      endDate: String
      description: String
      balance: Float!
      category: ID
    ): Debt
    updateDebt(
      debtId: ID!
      name: String
      currency: String
      interestRate: Float
      endDate: String
      description: String
      balance: Float
      category: ID
    ): Debt
    deleteDebt(debtId: ID!): Debt

    createMerchant(name: String!): Merchant
    updateMerchant(merchantId: ID!, name: String): Merchant
    deleteMerchant(merchantId: ID!): Merchant

    createNotification(
      timestamp: String!
      text: String!
      action: String!
    ): Notification
    updateNotification(
      notificationId: ID!
      timestamp: String
      text: String
      action: String
    ): Notification
    deleteNotification(notificationId: ID!): Notification

    createPurchase(
      name: String!
      startDate: String!
      endDate: String!
      price: Float!
      currency: String!
    ): Purchase
    updatePurchase(
      purchaseId: ID!
      name: String
      startDate: String
      endDate: String
      price: Float
      currency: String
    ): Purchase
    deletePurchase(purchaseId: ID!): Purchase

    createTransaction(
      name: String!
      price: Float!
      timestamp: String!
      description: String
      category: ID
      budget: ID
      merchant: ID
      payer: ID
      beneficiary: ID
    ): Transaction
    updateTransaction(
      transactionId: ID!
      name: String
      price: Float
      timestamp: String
      description: String
      category: ID
      budget: ID
      merchant: ID
      payer: ID
      beneficiary: ID
    ): Transaction
    deleteTransaction(transactionId: ID!): Transaction

    createUser(
      email: String!
      password: String!
      name: String!
      birthDate: String!
      country: String!
    ): User
    updateUser(
      email: String
      password: String
      name: String
      birthDate: String
      country: String
      photo: String
    ): User
    deleteUser: User
  }

  enum CategoryType {
    EXPENSE
    INCOME
    TRANSFER
  }

  enum BudgetRole {
    OBSERVER
    MEMBER
  }

  enum Plan {
    FREE
    PLUS
    PRO
  }

  type Category {
    id: ID!
    sourceUser: ID!
    name: String!
    type: CategoryType!
    icon: String!
    color: String!
  }

  type BankAccount {
    id: ID!
    name: String!
    currency: String!
    description: String
    balance: Float!
    category: Category
  }

  type User {
    id: ID!
    email: String!
    currentPlan: Plan!
    name: String!
    birthDate: String!
    country: String!
    photo: String
    budgets: [Budget!]
    bankAccounts: [BankAccount!]
    categories: [Category!]
    merchants: [Merchant!]
    debts: [Debt!]
    transactions: [Transaction!]
    cycleTransactions: [CycleTransaction!]
    purchases: [Purchase!]
    notifications: [Notification!]
  }

  type Merchant {
    id: ID!
    name: String!
  }

  type Budget {
    id: ID!
    name: String!
    members: [User!]!
    observers: [User!]
    transactions: [Transaction!]
    cycleTransactions: [CycleTransaction!]
  }

  type Transaction {
    id: ID!
    name: String!
    price: Float!
    timestamp: String!
    description: String
    category: Category
    budget: Budget
    merchant: Merchant
    payer: BankAccount
    beneficiary: BankAccount
  }

  type CycleTransaction {
    id: ID!
    name: String!
    price: Float
    lastPayment: String!
    period: String!
    description: String
    category: Category
    budget: Budget
    merchant: Merchant
    payer: BankAccount
    beneficiary: BankAccount
  }

  type Debt {
    id: ID!
    name: String!
    currency: String!
    interestRate: Float!
    endDate: String
    description: String
    balance: Float!
    category: Category
  }

  type Notification {
    id: ID!
    timestamp: String!
    text: String!
    action: String!
  }

  type Purchase {
    id: ID!
    name: String!
    startDate: String!
    endDate: String!
    price: Float!
    currency: String!
  }
`;
