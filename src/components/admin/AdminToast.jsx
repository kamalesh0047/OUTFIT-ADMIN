import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../../lib/AppContext'

export default function AdminToast() {
  const { toasts } = useApp()

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className="toast-item"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <span className="toast-dot" />
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
