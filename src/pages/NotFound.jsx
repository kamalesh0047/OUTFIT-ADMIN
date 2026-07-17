import { Link } from 'react-router-dom'
export default function NotFound() {
  return <div className="container section" style={{textAlign:'center',padding:'80px 0'}}><span className="eyebrow">404</span><h1 style={{fontSize:48,margin:'12px 0'}}>Page not found</h1><p style={{color:'var(--muted)',marginBottom:20}}>The page you're looking for has moved or no longer exists.</p><Link className="btn" to="/">Back to home</Link></div>
}
