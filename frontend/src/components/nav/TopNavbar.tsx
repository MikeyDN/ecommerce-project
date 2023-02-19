import Link from 'next/link'
import useAuth from '../../lib/useAuth'
export default function TopNavbar() {
  const { user } = useAuth()
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
              <Link className="nav-link" href="/categories">
                Categories
              </Link>
            </li>
            {user.phone && (
              <li>
                <Link className="nav-link" href="/orders">
                  My Orders
                </Link>
              </li>
            )}
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
