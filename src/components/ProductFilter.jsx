import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './product-filter.css'

export default function ProductFilter({ products, onFilter, showGenderFilter = false }) {
  const [expanded, setExpanded] = useState({ gender: true, price: false, size: false, color: false })
  const [filters, setFilters] = useState({ gender: [], price: [0, 50000], size: [], color: [] })

  const genders = ['Men', 'Women']
  const allSizes = ['S', 'M', 'L', 'XL', '7', '8', '9', '10', '11']
  const allColors = [
    'Black', 'White', 'Gray', 'Charcoal',
    'Red', 'Crimson', 'Scarlet', 'Maroon',
    'Pink', 'Rose', 'Salmon', 'Coral',
    'Orange', 'Apricot', 'Peach', 'Tan',
    'Yellow', 'Gold', 'Khaki', 'Beige',
    'Green', 'Olive', 'Sage', 'Mint',
    'Teal', 'Cyan', 'Navy', 'Blue',
    'Purple', 'Indigo', 'Violet', 'Plum',
    'Brown', 'Tan', 'Chocolate', 'Coffee',
    'Silver', 'Ivory', 'Cream', 'Nude'
  ]

  const handleSizeChange = (size) => {
    const newSizes = filters.size.includes(size)
      ? filters.size.filter(s => s !== size)
      : [...filters.size, size]
    const updated = { ...filters, size: newSizes }
    setFilters(updated)
    applyFilters(updated)
  }

  const handleColorChange = (color) => {
    const newColors = filters.color.includes(color)
      ? filters.color.filter(c => c !== color)
      : [...filters.color, color]
    const updated = { ...filters, color: newColors }
    setFilters(updated)
    applyFilters(updated)
  }

  const handlePriceRange = (min, max) => {
    const updated = { ...filters, price: [min, max] }
    setFilters(updated)
    applyFilters(updated)
  }

  const getProductGender = (product) => {
    if (product.category === 'dresses') return 'Women'
    if (product.name?.toLowerCase().includes("women's")) return 'Women'
    if (product.name?.toLowerCase().includes("men's")) return 'Men'
    return 'Unisex'
  }

  const handleGenderChange = (gender) => {
    const newGenders = filters.gender.includes(gender)
      ? filters.gender.filter(g => g !== gender)
      : [...filters.gender, gender]
    const updated = { ...filters, gender: newGenders }
    setFilters(updated)
    applyFilters(updated)
  }

  const applyFilters = (activeFilters) => {
    const filtered = products.filter(p => {
      // Gender filter
      if (showGenderFilter && activeFilters.gender.length > 0) {
        const productGender = getProductGender(p)
        if (!activeFilters.gender.includes(productGender)) {
          return false
        }
      }

      // Price filter
      if (p.price < activeFilters.price[0] || p.price > activeFilters.price[1]) {
        return false
      }

      // Size filter
      if (activeFilters.size.length > 0) {
        const hasSize = activeFilters.size.some(s => p.sizes?.includes(s))
        if (!hasSize) return false
      }

      // Color filter
      if (activeFilters.color.length > 0) {
        const hasColor = activeFilters.color.some(c => p.colors?.includes(c))
        if (!hasColor) return false
      }

      return true
    })

    onFilter(filtered)
  }

  const toggleExpand = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const activeCount = filters.gender.length + filters.size.length + filters.color.length + (filters.price[0] > 0 || filters.price[1] < 20000 ? 1 : 0)

  return (
    <div className="product-filter">
      <div className="filter-header">
        <h3>Filters</h3>
        {activeCount > 0 && (
          <button
            className="filter-reset"
            onClick={() => {
              setFilters({ gender: [], price: [0, 50000], size: [], color: [] })
              applyFilters({ gender: [], price: [0, 50000], size: [], color: [] })
            }}
          >
            Clear ({activeCount})
          </button>
        )}
      </div>

      {showGenderFilter && (
        <div className="filter-section">
          <button className="filter-toggle" onClick={() => toggleExpand('gender')}>
            <span>Gender</span>
            <ChevronDown size={16} className={expanded.gender ? 'expanded' : ''} />
          </button>
          {expanded.gender && (
            <div className="filter-options">
              {genders.map(gender => (
                <label key={gender} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.gender.includes(gender)}
                    onChange={() => handleGenderChange(gender)}
                  />
                  <span>{gender}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Filter */}
      <div className="filter-section">
        <button className="filter-toggle" onClick={() => toggleExpand('price')}>
          <span>Price</span>
          <ChevronDown size={16} className={expanded.price ? 'expanded' : ''} />
        </button>
        {expanded.price && (
          <div className="price-slider-container">
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                max="50000"
                value={filters.price[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), filters.price[1])
                  handlePriceRange(val, filters.price[1])
                }}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                min="0"
                max="50000"
                value={filters.price[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), filters.price[0])
                  handlePriceRange(filters.price[0], val)
                }}
                className="price-input"
              />
            </div>
            <div className="range-slider">
              <input
                type="range"
                min="0"
                max="50000"
                value={filters.price[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), filters.price[1])
                  handlePriceRange(val, filters.price[1])
                }}
                className="range-input range-input-min"
              />
              <input
                type="range"
                min="0"
                max="50000"
                value={filters.price[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), filters.price[0])
                  handlePriceRange(filters.price[0], val)
                }}
                className="range-input range-input-max"
              />
              <div className="range-track">
                <div className="range-fill" style={{left: `${(filters.price[0]/50000)*100}%`, right: `${100-(filters.price[1]/50000)*100}%`}} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="filter-section">
        <button className="filter-toggle" onClick={() => toggleExpand('size')}>
          <span>Size</span>
          <ChevronDown size={16} className={expanded.size ? 'expanded' : ''} />
        </button>
        {expanded.size && (
          <div className="filter-options size-grid">
            {allSizes.map(size => (
              <label key={size} className="filter-size">
                <input
                  type="checkbox"
                  checked={filters.size.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="filter-section">
        <button className="filter-toggle" onClick={() => toggleExpand('color')}>
          <span>Color</span>
          <ChevronDown size={16} className={expanded.color ? 'expanded' : ''} />
        </button>
        {expanded.color && (
          <div className="color-grid">
            {allColors.map(color => (
              <label key={color} className="color-swatch">
                <input
                  type="checkbox"
                  checked={filters.color.includes(color)}
                  onChange={() => handleColorChange(color)}
                  className="color-input"
                />
                <div className="swatch" data-color={color.toLowerCase()} />
                <span className="color-label">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
