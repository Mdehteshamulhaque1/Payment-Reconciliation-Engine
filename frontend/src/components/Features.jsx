import { motion } from 'framer-motion'
import { CheckCircle2, BarChart3, Zap, Lock, Clock, FileText } from 'lucide-react'
import { staggerContainer, staggerItem } from '../animations/motionVariants'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process thousands of transactions in seconds with our optimized engine'
  },
  {
    icon: CheckCircle2,
    title: 'Automatic Matching',
    description: 'AI-powered algorithm matches transactions with 99.9% accuracy'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Get instant insights into payment discrepancies and patterns'
  },
  {
    icon: Lock,
    title: 'Bank-level Security',
    description: 'Enterprise-grade encryption and compliance with all standards'
  },
  {
    icon: Clock,
    title: 'Automated Workflows',
    description: 'Set up rules and let the system work 24/7 without intervention'
  },
  {
    icon: FileText,
    title: 'Detailed Reports',
    description: 'Export comprehensive reconciliation reports in multiple formats'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-section px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-dark-900 mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to streamline payment reconciliation
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={staggerItem}
                className="group p-8 rounded-xl card-shadow hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
