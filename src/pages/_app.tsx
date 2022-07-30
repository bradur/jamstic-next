import type { AppProps } from 'next/app'
import { Fragment } from 'react'
import SiteContainer from '../frontend/components/SiteContainer'
import SiteNavigation from '../frontend/components/SiteNavigation'
import GlobalStyle from './globalStyles'

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Fragment>
      <GlobalStyle />
      <SiteContainer>
        <SiteNavigation router={router} />
        <Component {...pageProps} />
      </SiteContainer>
    </Fragment>
  )
}

export default MyApp
