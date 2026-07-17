import { motion } from 'framer-motion'
export default function Reveal({ children, delay = 0, y = 24, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: .99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: .55, delay, ease: [0.22,0.61,0.36,1] }}
    >{children}</motion.div>
  )
}
