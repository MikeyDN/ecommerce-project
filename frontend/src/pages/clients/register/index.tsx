import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import {
  Combobox,
  ComboboxPopover,
  useComboboxState,
  ComboboxItem,
} from 'ariakit/combobox'
import { countryCodes } from '../../../lib/countrycodes'

// export async function getServerSideProps() {
//   const client = await newClient.getClient()
//   return {
//     props: {
//       countryCodes,
//     },
//   }
// }

export default function Register() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const combobox = useComboboxState({
    gutter: 4,
    sameWidth: true,
    list: countryCodes.map((country) => country.dial_code),
    defaultValue: '+972',
  })
  useEffect(() => {
    if (phone.startsWith('0')) {
      setPhone(phone.slice(1))
    }
  }, [phone])

  return (
    <>
      <Head>
        <title>Buddy's e-Shop</title>
      </Head>
      <div className="login-wrapper">
        <div className="beautiful-box login-box">
          <div className="login-title">Register</div>
          <div className="login-input">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%' }}
            />
            <input
              type="text"
              name="email"
              placeholder="eMail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%' }}
            />
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
              type="text"
              name="phone"
              placeholder="Phone number"
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
                router.push(`/clients/login/${combobox.value + phone}`)
              }}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
