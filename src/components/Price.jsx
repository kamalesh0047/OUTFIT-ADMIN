/** Global reusable price display – MRP strike + selling + auto discount */
export const inr = (n) => {
  const num = Number(n) || 0
  return '₹' + num.toLocaleString('en-IN')
}

export function calcDiscount(mrp, selling) {
  const m = Number(mrp) || 0
  const s = Number(selling) || 0
  if (!m || m <= s) return 0
  return Math.round(((m - s) / m) * 100)
}

/**
 * @param {number} price - Selling price
 * @param {number} [original] - MRP / originalPrice
 * @param {boolean} [showBadge=true] - Show "X% OFF" badge
 * @param {'sm'|'md'|'lg'} [size='md']
 */
export default function Price({ price, original, showBadge = true, size = 'md' }) {
  const selling = Number(price) || 0
  const mrp = Number(original) || 0
  const discount = calcDiscount(mrp, selling)
  const hasDiscount = discount > 0

  const sizes = {
    sm: { sell: 14, mrp: 12, badge: 10 },
    md: { sell: 16, mrp: 13, badge: 11 },
    lg: { sell: 22, mrp: 15, badge: 12 },
  }
  const s = sizes[size] || sizes.md

  return (
    <span className="price" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
      <strong
        className="price__sell"
        style={{ fontFamily: 'var(--font-head)', fontSize: s.sell, fontWeight: 600, color: 'var(--ink)' }}
      >
        {inr(selling)}
      </strong>
      {hasDiscount && (
        <>
          <span
            className="price__mrp"
            style={{ color: 'var(--muted)', textDecoration: 'line-through', fontSize: s.mrp }}
          >
            {inr(mrp)}
          </span>
          {showBadge && (
            <span
              className="price__off"
              style={{
                fontSize: s.badge,
                fontWeight: 700,
                color: '#c45c26',
                letterSpacing: '0.02em',
              }}
            >
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </span>
  )
}
