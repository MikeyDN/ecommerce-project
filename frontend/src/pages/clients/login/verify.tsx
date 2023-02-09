import { useRouter } from 'next/router'
import { newClient } from '../../../lib/RootClient'
import { OrderClient, OtpResponse } from '../../../lib/types'
import { useCookies } from 'react-cookie'

type PageProps = {
  query: {
    phone: string
    otp: string
  }
}

export async function getServerSideProps(context: PageProps) {
  const client: OrderClient = await newClient.getClient(context.query.phone)

  if (client.phone) {
    const response = await newClient.verifyOtp(client.phone, context.query.otp)
    return {
      props: {
        client,
        response,
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

function Home({
  client,
  response,
}: {
  client: OrderClient
  response: OtpResponse
}) {
  const router = useRouter()
  const [cookie, setCookie, removeCookie] = useCookies(['token'])
  if (response.token) {
    setCookie('token', response.token)
    router.push('/')
  } else {
    return response
  }
}
export default Home
