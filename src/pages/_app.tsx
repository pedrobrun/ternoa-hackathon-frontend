import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import Layout from '@/components/ui/Layout'
import WCProvider from '@/utils/wallet-connect/provider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <WCProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WCProvider>
    </SessionProvider>
  )
}
