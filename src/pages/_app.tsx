import type { AppProps } from 'next/app'
import { Fragment } from 'react'
import SiteContainer from '../frontend/components/SiteContainer'
import SiteNavigation from '../frontend/components/SiteNavigation'
import GlobalStyle from './globalStyles'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <GlobalStyle />
      <SiteContainer>
        <SiteNavigation />
        <Component {...pageProps} />
      </SiteContainer>
    </Fragment>
  )
}

export default MyApp
