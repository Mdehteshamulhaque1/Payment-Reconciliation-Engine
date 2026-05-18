import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'
import { Search, Filter, Download, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const transactions = [
  { id: 'TXN001', amount: '$5,240.50', status: 'matched', date: 'May 12, 2024', merchant: 'Tech Solutions Inc' },
  { id: 'TXN002', amount: '$1,850.00', status: 'matched', date: 'May 12, 2024', merchant: 'Cloud Services Ltd' },
  { id: 'TXN003', amount: '$3,125.75', status: 'pending', date: 'May 11, 2024', merchant: 'Global Payments' },
  { id: 'TXN004', amount: '$890.25', status: 'matched', date: 'May 11, 2024', merchant: 'Digital Ventures' },
  { id: 'TXN005', amount: '$2,450.00', status: 'resolved', date: 'May 10, 2024', merchant: 'Finance Corp' },
]

const statusColors = {
  matched: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-blue-100 text-blue-800',
}

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = transactions.filter(tx =>
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.merchant.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-dark-900 mb-2">Transaction History</h1>
              <p className="text-gray-600">View and manage all your payment transactions</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg border border-gray-300 hover:border-blue-600 transition-colors">
              <Download size={18} />
              Export
            </button>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by transaction ID or merchant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-600 transition-colors">
              <Filter size={18} />
              Filter
            </button>
          </motion.div>

          {/* Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl overflow-hidden card-shadow"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark-900">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark-900">Merchant</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark-900">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-dark-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{tx.id}</td>
                      <td className="px-6 py-4 text-sm text-dark-900">{tx.merchant}</td>
                      <td className="px-6 py-4 text-sm font-bold text-dark-900">{tx.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[tx.status]}`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500">No transactions found matching your search.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
