import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Instagram, MapPin, Mail } from 'lucide-react'
import { useToast } from '../context/ToastContext.jsx'
import './about.css'

const PageMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 },
}

const CONTACT_EMAIL = 'parthiravi20@gmail.com'

export default function About() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleEmailClick = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL)
    addToast('Email copied to clipboard!')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      // Sends the form as an email to parthiravi20@gmail.com via FormSubmit
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          _subject: `OUTFIT Website Query from ${formData.name.trim()}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message')
      }

      addToast("Query sent successfully! We'll get back to you soon.")
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('Query submit error:', err)
      addToast('Could not send your query. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div {...PageMotion}>
      {/* ABOUT HERO */}
      <section className="about-hero">
        <div className="container about-hero__content">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F6d6fa49e05dc4ee5b306c7e8fab303d9%2F92237b3d7aef4df69a9ce148cc392c45?format=webp&width=800&height=1200"
            alt="OUTFIT Logo"
            className="about-hero__logo"
          />
          <h1>About OUTFIT</h1>
          <p>
            <b>Serving Style Since 2018 — Timeless Fashion, Trusted Quality</b>
          </p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="section container">
        <div className="about-grid">
          <motion.div className="contact-card" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="contact-card__icon">
              <Phone size={28} />
            </div>
            <h3>Call Us</h3>
            <a href="tel:+919600077554" className="contact-card__link">
              +91 96000 77554
            </a>
            <p>Mon – Sat, 10 AM – 8 PM</p>
          </motion.div>

          <motion.div className="contact-card" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="contact-card__icon">
              <Instagram size={28} />
            </div>
            <h3>Instagram</h3>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card__link"
            >
              @outfit
            </a>
            <p>Follow for new drops</p>
          </motion.div>

          <motion.div className="contact-card" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="contact-card__icon">
              <MapPin size={28} />
            </div>
            <h3>Visit Us</h3>
            <p className="contact-card__link" style={{ cursor: 'default' }}>
              No. 9, Lakshmi Amman Kovil Street,
              <br />
              Perambur, Chennai – 600011
            </p>
            <a
              href="https://maps.app.goo.gl/zkG8VCkQ3NJ5kRWDA?g_st=iw"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card__link"
            >
              View on Maps
            </a>
          </motion.div>

          <motion.div className="contact-card" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="contact-card__icon">
              <Mail size={28} />
            </div>
            <h3>Email Us</h3>
            <button type="button" className="contact-card__link" onClick={handleEmailClick}>
              {CONTACT_EMAIL}
            </button>
            <p>We respond within 24 hours</p>
          </motion.div>
        </div>
      </section>

      {/* QUERY SECTION */}
      <section className="section container">
        <div className="query-section">
          <div className="query-head">
            <h2>Have a Query?</h2>
            <p>Send us your questions or feedback and we&apos;ll get back to you shortly.</p>
          </div>

          <form className="query-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                className="input"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                className="input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                className="input query-textarea"
                placeholder="Your query or feedback..."
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn--block" disabled={loading}>
              {loading ? 'Sending...' : 'Submit Query'}
            </button>
          </form>
        </div>
      </section>
    </motion.div>
  )
}