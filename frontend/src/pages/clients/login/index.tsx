import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import {
  Combobox,
  ComboboxPopover,
  useComboboxState,
  ComboboxItem,
} from 'ariakit/combobox'
import { countryCodes } from '../../../lib/countrycodes'

function Home() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const combobox = useComboboxState({
    gutter: 4,
    sameWidth: true,
    list: countryCodes.map((country) => country.dial_code),
    defaultValue: '+972',
  })

  return (
    <>
      <Head>
        <title>Buddy's e-Shop</title>
      </Head>
      <div className="login-wrapper">
        <div className="beautiful-box login-box">
          <div className="login-title">Login</div>
          <div className="login-input">
            <Combobox
              state={combobox}
              className="combobox"
              style={{ width: '20%' }}
            />
            <ComboboxPopover state={combobox} className="popover">
              {combobox.matches.length ? (
                combobox.matches.map((value) => (
                  <ComboboxItem
                    key={value}
                    value={value}
                    className="combobox-item"
                  />
                ))
              ) : (
                <div className="no-results">No results found</div>
              )}
            </ComboboxPopover>
            <input
              className="combobox"
              type="text"
              name="phone"
              placeholder="Phone"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '80%' }}
              required
            />
          </div>
          <div className="login-button">
            <Button
              className="button"
              onClick={() => {
                router.push(`/clients/${phone}`)
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
export default Home
