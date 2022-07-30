import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/games')
  })

  return (
    <div>
      <Head>
        <title>jamsticnext</title>
        <meta name='description' content='Jamstic-Next' />
        <link rel='icon' type='image/png' href='/favicon.png' />
      </Head>
    </div>
  )
}

export default Home
