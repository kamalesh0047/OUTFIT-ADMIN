import { X } from 'lucide-react'
import { useToast } from '../context/ToastContext.jsx'
import './toast.css'

export default function Toast() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          <div className="toast-content">
            <p>{toast.message}</p>
            {toast.action && (
              <button
                className="toast-action"
                onClick={() => {
                  toast.action.onClick?.()
                  removeToast(toast.id)
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
