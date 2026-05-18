import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const stats = [
  { label: 'Transactions Processed', value: '500M+' },
  { label: 'Global Clients', value: '10K+' },
  { label: 'Uptime', value: '99.99%' },
  { label: 'Average Match Rate', value: '99.9%' }
]

function AnimatedCounter({ end, duration = 2 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        // Extract number from end string
        const numEnd = parseInt(end.replace(/[^\d]/g, ''))
        setCount(Math.floor(numEnd * progress))
        requestAnimationFrame(animate)
      } else {
        setCount(parseInt(end.replace(/[^\d]/g, '')))
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{count}{end.replace(/\d/g, '')}</span>
}

export default function Stats() {
  return (
    <section className="py-section px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-dark-900 to-dark-800 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                <AnimatedCounter end={stat.value} />
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
