import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full glass-effect z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:inline text-dark-900">PayFlow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">About</a>
            <Link to="/dashboard" className="btn-primary">Dashboard</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 border-t border-gray-200"
          >
            <a href="#features" className="block py-2 text-sm font-medium text-gray-700">Features</a>
            <a href="#pricing" className="block py-2 text-sm font-medium text-gray-700">Pricing</a>
            <a href="#about" className="block py-2 text-sm font-medium text-gray-700">About</a>
            <Link to="/dashboard" className="btn-primary block text-center mt-4">Dashboard</Link>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
