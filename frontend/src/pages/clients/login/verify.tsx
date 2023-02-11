import { useRouter } from 'next/router'
import { rootClient } from '../../../lib/RootClient'
import { OrderClient, OtpResponse } from '../../../lib/types'
import { useCookies } from 'react-cookie'

type PageProps = {
  query: {
    phone: string
    otp: string
  }
}

export async function getServerSideProps(context: PageProps) {
  const client: OrderClient = await rootClient.getClient(context.query.phone)

  if (client.phone) {
    const response = await rootClient.verifyOtp(client.phone, context.query.otp)
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
