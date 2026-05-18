import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-section px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-12 md:p-20 text-white text-center shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Payments?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            Get Started Now <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
