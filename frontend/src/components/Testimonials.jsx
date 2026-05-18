import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { staggerContainer, staggerItem } from '../animations/motionVariants'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CFO, FinTech Corp',
    content: 'PayFlow reduced our reconciliation time by 80%. The accuracy is unmatched.',
    avatar: '👨‍💼',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Head of Operations, Global Payments',
    content: 'Best investment we made this year. Seamless integration and incredible support.',
    avatar: '👩‍💼',
    rating: 5
  },
  {
    name: 'Emma Rodriguez',
    role: 'Payment Manager, Enterprise Bank',
    content: 'The automated workflows alone saved us thousands in manual hours.',
    avatar: '👨‍💻',
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section className="py-section px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600">Join thousands of companies using PayFlow</p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="p-8 bg-white rounded-xl card-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold text-dark-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
