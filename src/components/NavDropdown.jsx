import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import './nav-dropdown.css'

export default function NavDropdown() {
  const [openMenu, setOpenMenu] = useState(null)

  const categories = {
    men: [
      { label: 'Shirts', path: '/category/shirts' },
      { label: 'Pants', path: '/category/pants' },
    ],
    women: [
      { label: 'Dresses', path: '/category/women-dresses' },
    ],
  }

  const DropdownGroup = ({ type, label, items }) => (
    <div
      className="nav-dropdown"
      onMouseEnter={() => setOpenMenu(type)}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <button
        className="nav-dropdown-trigger"
        onClick={(e) => {
          e.stopPropagation()
          setOpenMenu(openMenu === type ? null : type)
        }}
      >
        {label}
        <ChevronDown size={16} className={openMenu === type ? 'expanded' : ''} />
      </button>
      {openMenu === type && (
        <div className="nav-dropdown-menu">
          {items.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="nav-dropdown-item"
              onClick={() => setOpenMenu(null)}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      <DropdownGroup type="men" label="Men" items={categories.men} />
      <DropdownGroup type="women" label="Women" items={categories.women} />
      {openMenu && <div className="nav-dropdown-overlay" onClick={() => setOpenMenu(null)} />}
    </>
  )
}
