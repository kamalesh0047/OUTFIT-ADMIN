import { Star } from 'lucide-react'
export default function Rating({ value = 0, size = 14, count }) {
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:4}} aria-label={`Rated ${value} of 5`}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={size} fill={n <= Math.round(value) ? '#0A0A0A' : 'none'} stroke={n <= Math.round(value) ? '#0A0A0A' : '#C9C9C9'} />
      ))}
      {count != null && <span style={{fontSize:12,color:'var(--muted)',marginLeft:4}}>({count})</span>}
    </span>
  )
}
