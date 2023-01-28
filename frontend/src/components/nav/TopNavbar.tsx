import { useEffect, useState } from 'react'
import CollapseMenu from './CollapseMenu'
import Link from 'next/link'
import { Category } from '../../lib/types'
import cache from '../../lib/cache'

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await cache.getCategories()
      setCategories(categories)
    }
    fetchCategories()
  }, [])
  return (
    <>
      <nav className="top-navbar">
        <Link className="navbar-brand" href="/">
          <img
            src="/assets/images/buddys-logo.png"
            className="logo"
            alt="website template image"
          />
        </Link>
        <div className="navbar-links">
          <ul>
            <li>
              <Link className="nav-link" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/products/all">
                Explore
              </Link>
            </li>
            <li>
              <CollapseMenu title="Categories" id="categories-collapse">
                {categories.map((category: Category, key: number) => (
                  <CollapseMenu.Item
                    href={`/categories/${encodeURIComponent(category.slug)}`}
                    key={key}
                  >
                    <span>{category.name}</span>
                  </CollapseMenu.Item>
                ))}
              </CollapseMenu>
            </li>
            <li>
              <Link className="nav-link" href="/">
                About
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
