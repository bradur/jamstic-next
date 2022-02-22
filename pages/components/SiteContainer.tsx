import Head from 'next/head'
import { ReactNode } from 'react'
import styled from 'styled-components'

const SiteContainerStyled = styled.div`
  position: relative;
`

type Props = {
  children: ReactNode,
}

const SiteContainer = ({ children }: Props) => {
  return (
    <SiteContainerStyled>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      {children}
    </SiteContainerStyled>
  )
}

export default SiteContainer
