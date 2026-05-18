// TypeScript-like type definitions for common data structures

/**
 * @typedef {Object} Transaction
 * @property {string} id - Transaction ID
 * @property {number} amount - Amount in cents
 * @property {string} status - 'matched', 'pending', 'resolved'
 * @property {string} date - ISO date string
 * @property {string} merchant - Merchant name
 * @property {string} reference - Reference number
 */

/**
 * @typedef {Object} Stats
 * @property {number} totalTransactions - Total transactions processed
 * @property {number} matchRate - Match rate percentage
 * @property {number} discrepancies - Number of discrepancies
 * @property {number} avgProcessingTime - Average processing time in ms
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} role - User role
 */

export const TransactionStatus = {
  MATCHED: 'matched',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  FAILED: 'failed'
}

export const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer'
}
