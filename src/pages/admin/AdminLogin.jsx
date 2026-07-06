import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_EMAIL = 'admin@aurelis.com'
const ADMIN_PASS = 'aurelis123'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = () => {
    if (email !== ADMIN_EMAIL || pass !== ADMIN_PASS) {
      setError('Invalid email or password')
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        <h2>Aurelis Admin</h2>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@aurelis.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••••" />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" onClick={login}>Sign in</button>
      </div>
    </div>
  )
}
