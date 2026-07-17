import './footer.css'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__bar"><span>© {new Date().getFullYear()} OUTFIT. All rights reserved.</span><span>Made for a world-class fashion ecosystem.</span></div>
    </footer>
  )
}
