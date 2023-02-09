import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { newClient } from '../../../lib/RootClient'
import { OrderClient } from '../../../lib/types'
import { Button } from 'react-bootstrap'

type PageProps = {
  query: {
    phone: string
  }
}

export async function getServerSideProps(context: PageProps) {
  const client: OrderClient = await newClient.getClient(context.query.phone)

  if (client.phone) {
    await newClient.sendOtp(client.phone)
    return {
      props: {
        client,
      },
    }
  } else {
    return {
      props: {
        client: null,
      },
    }
  }
}

function Home({ client }: { client: OrderClient }) {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  return (
    <>
      <Head>
        <title>Buddy's e-Shop</title>
      </Head>
      <div className="login-wrapper">
        <div className="beautiful-box login-box">
          <div className="login-title">Login</div>
          <div className="login-input">
            <p>
              We've sent a code to {client.phone}, You can enter it below to
              proceed
            </p>
            <input
              className="combobox"
              type="text"
              name="phone"
              placeholder="OTP Code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button
              variant="primary"
              onClick={() =>
                router.push(`/clients/login/${client.phone}?otp=${otp}`)
              }
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
