import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Heart, MapPin, MailCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebase";
import Address from "../components/Address";
import Orders from "../components/Orders";
const TABS = [['orders','Orders',Package],['wishlist','Wishlist',Heart],['address','Addresses',MapPin]]

// Human-friendly Firebase auth errors
function friendly(err) {
  const code = err?.code || ''
  const map = {
    'auth/invalid-credential': 'Incorrect email or password',
    'auth/wrong-password': 'Incorrect email or password',
    'auth/user-not-found': 'No account found with this email',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/too-many-requests': 'Too many attempts — please wait a minute and try again',
    'auth/network-request-failed': 'Network error — check your connection',
  }
  return map[code] || err?.message || 'Something went wrong'
}

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout, loading: authLoading } = useAuth()
  const { addToast } = useToast()
  const [mode, setMode] = useState("login")
  const [tab, setTab] = useState("orders")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  // When set, we show the "verify your email" panel instead of the form
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (!authLoading && isLoggedIn && location.state?.from) {
      navigate(location.state.from, { replace: true });
    }
  }, [authLoading, isLoggedIn, location.state, navigate]);

  // resend cooldown tick
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const register = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName: fullName,
        email: email,
        role: "customer",
        createdAt: serverTimestamp(),
      });
      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      addToast("Account created — verification email sent");
      setPendingVerifyEmail(email);
      setResendCooldown(30);
      setMode("login");
    } catch (err) {
      addToast(friendly(err));
    } finally { setLoading(false); }
  };

  const signIn = async (e) => {
    e?.preventDefault?.();
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // reload to pick up a verification that just happened
      await userCredential.user.reload();
      if (!userCredential.user.emailVerified) {
        setPendingVerifyEmail(email);
        await signOut(auth);
        addToast("Please verify your email to continue");
        return;
      }
      // Verified: sign in again so AuthContext's listener sees a verified user
      await signInWithEmailAndPassword(auth, email, password);
      addToast("Welcome back!");
    } catch (err) {
      addToast(friendly(err));
    } finally { setLoading(false); }
  };

  // Resend the verification email (requires a silent sign-in first)
  const resendVerification = async () => {
    if (!email || !password) { addToast("Enter your email and password first"); return }
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await cred.user.reload();
      if (cred.user.emailVerified) {
        addToast("Your email is already verified — signing you in");
        return; // AuthContext picks up the verified session
      }
      await sendEmailVerification(cred.user);
      await signOut(auth);
      setResendCooldown(30);
      addToast("Verification email re-sent — check inbox & spam");
    } catch (err) {
      addToast(friendly(err));
    } finally { setLoading(false); }
  };

  if (authLoading) return null;

  if (!isLoggedIn) return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="container section" style={{maxWidth:440}}>
      <div className="auth">
        {pendingVerifyEmail ? (
          /* ── VERIFY EMAIL PANEL ── */
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
              <MailCheck size={26} />
            </div>
            <h3 style={{ marginBottom: 8 }}>Verify your email</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 4 }}>
              We sent a verification link to
            </p>
            <p style={{ fontWeight: 600, marginBottom: 14 }}>{pendingVerifyEmail}</p>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
              Click the link in the email, then come back here.
            </p>
            <p style={{ color: '#ff6b6b', fontSize: 13, lineHeight: 1.6, marginBottom: 18, fontWeight: 500 }}>
              Please check your spam mail too!
            </p>
            <button className="btn btn--block" disabled={loading} onClick={() => signIn()}>
              {loading ? 'Checking…' : "I've verified — Sign in"}
            </button>
            <button
              className="btn btn--ghost btn--block"
              style={{ marginTop: 10 }}
              disabled={loading || resendCooldown > 0}
              onClick={resendVerification}
            >
              {resendCooldown > 0 ? `Resend email (${resendCooldown}s)` : 'Resend verification email'}
            </button>
            <button
              onClick={() => setPendingVerifyEmail(null)}
              style={{ marginTop: 14, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Back to login
            </button>
          </div>
        ) : (
          /* ── LOGIN / REGISTER FORM ── */
          <>
            <div className="auth__tabs"><button className={mode==='login'?'is-on':''} onClick={()=>setMode('login')}>Login</button><button className={mode==='register'?'is-on':''} onClick={()=>setMode('register')}>Register</button></div>
            <form onSubmit={mode === "login" ? signIn : register} className="auth__form">
              {mode === "register" && (
                <div className="field">
                  <label>Full name</label>
                  <input className="input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
              )}
              <div className="field"><label>Email</label><input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required /></div>
              <div className="field"><label>Password</label><input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required /></div>
              <button className="btn btn--block" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </button>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { if (!email) { addToast('Enter your email above first'); return } setPendingVerifyEmail(email) }}
                  style={{ marginTop: 10, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', width: '100%' }}
                >
                  Didn't get your verification email?
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </motion.div>
  )

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="container section account">
      <aside className="account__nav">{TABS.map(([k,l,Icon])=>(<button key={k} className={tab===k?'is-on':''} onClick={()=>setTab(k)}><Icon size={17}/> {l}</button>))}<button
        onClick={async () => {
          await signOut(auth);
          logout();
        }}
        className="account__logout"
      >
        Sign out
      </button></aside>
      <div className="account__panel">
        {tab === "address" && <Address />}
        {tab === "orders" && <Orders />}
        {tab==='wishlist' && <div><h2>Wishlist</h2><p style={{color:'var(--muted)',marginTop:8}}>Saved items appear on your <a href="/wishlist">wishlist page</a>.</p></div>}
      </div>
    </motion.div>
  )
}
