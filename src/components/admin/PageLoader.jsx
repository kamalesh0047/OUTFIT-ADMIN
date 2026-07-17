import { motion, AnimatePresence } from 'framer-motion'
import { usePageTransition } from '../../lib/usePageTransition'

export default function PageLoader() {
  const loading = usePageTransition()

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="page-loader"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.85 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'left' }}
        />
      )}
    </AnimatePresence>
  )
}
