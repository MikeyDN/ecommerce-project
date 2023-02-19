import React from 'react'
import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import BotNavbar from '../Nav/BotNavbar'
import useAuth from '../../lib/useAuth'
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons'
import {
  faHouse,
  faCompass,
  faCubesStacked,
  faCircleQuestion,
  faShoppingCart,
  faRss,
  faEnvelopesBulk,
} from '@fortawesome/free-solid-svg-icons'

function HiddenMenu() {
  const { user } = useAuth()
  if (user.phone) {
    return <BotNavbar.Item href="/orders" icon={faEnvelopesBulk} />
  } else {
    return <BotNavbar.Item href="/categories" icon={faCubesStacked} />
  }
}

function Footer() {
  return (
    <>
      <BotNavbar>
        <BotNavbar.Item href="/" icon={faHouse} />
        <BotNavbar.Item href="/products/all" icon={faCompass} />
        <BotNavbar.Item href="/cart" icon={faShoppingCart} />
        {HiddenMenu()}
        <BotNavbar.Item href="/faq" icon={faCircleQuestion} />
      </BotNavbar>
      <div className="footer">
        <Container>
          <div>
            <img
              className="logo"
              style={{ marginTop: '-30px' }}
              src="/assets/images/buddys-logo.png"
              alt="website template image"
            />
          </div>

          <div className="footer-menu">
            <ul>
              <li>
                <a href="https://www.free-css.com/free-css-templates">Home</a>
              </li>
              <li>
                <a href="https://www.free-css.com/free-css-templates">Help</a>
              </li>
              <li>
                <a href="https://www.free-css.com/free-css-templates">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://www.free-css.com/free-css-templates">
                  How It Works ?
                </a>
              </li>
              <li>
                <a href="https://www.free-css.com/free-css-templates">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="social-icons">
            <ul>
              <li>
                <div>
                  <Link href="/" className="media-link">
                    <FontAwesomeIcon icon={faFacebook} />
                  </Link>
                </div>
              </li>
              <li>
                <div>
                  <Link href="/" className="media-link">
                    <FontAwesomeIcon icon={faTwitter} />
                  </Link>
                </div>
              </li>
              <li>
                <Link href="/" className="media-link">
                  <FontAwesomeIcon icon={faLinkedin} />
                </Link>
              </li>
              <li>
                <Link href="/" className="media-link">
                  <FontAwesomeIcon icon={faRss} />
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Footer
