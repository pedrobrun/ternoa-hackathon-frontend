import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import Layout from '@/components/ui/Layout'
import { ClientContextProvider } from '@/utils/wallet-connect/provider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <ClientContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ClientContextProvider>
    </SessionProvider>
  )
}
