import Client from '@walletconnect/sign-client'
import type { SessionTypes } from '@walletconnect/types'
import { getAppMetadata } from '@walletconnect/utils'
import { signIn, signOut, useSession } from 'next-auth/react'
import { createContext, useEffect, useState } from 'react'

import Modal from '@/components/ui/Modal'
import QRCode from '@/components/ui/QrCode'

const chainId = process.env['NEXT_PUBLIC_CHAIN_ID'] ?? 'ternoa:18bcdb75a0bba577b084878db2dc2546'
const chainName = chainId.split(':')[0]
const relayUrl = process.env['NEXT_PUBLIC_RELAY_URL'] ?? 'wss://wallet-connectrelay.ternoa.network'
const projectId = process.env['PROJECT_ID'] ?? 'a982a87b2c64a9c35d08a036abfbfc7e'
const name = process.env['NEXT_PUBLIC_PROJECT_NAME'] ?? 'Paris Blockchain Week 2023'
const description = process.env['NEXT_PUBLIC_PROJECT_DESCRIPTION'] ?? 'Paris Blockchain Week 2023'
const metadata = {
  name,
  description,
  url: getAppMetadata().url,
  icons: ['public/logos/logo.svg'],
}

interface IWCProvider {
  children: JSX.Element
}

export const WCQRLinkCtx = createContext<string | undefined>(undefined)
export const WCClientCtx = createContext<Client | undefined>(undefined)
export const OpenQrModal = createContext<React.Dispatch<boolean> | undefined>(undefined)

const WCProvider = ({ children }: IWCProvider) => {
  const session = useSession()
  const [client, setClient] = useState<Client>()
  const [wcSession, setWcSession] = useState<SessionTypes.Struct>()
  const [QRUri, setQRUri] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function createClient() {
      const localClient = await Client.init({
        logger: process.env.NODE_ENV === 'development' ? 'debug' : 'silent',
        relayUrl,
        projectId,
        metadata,
      })
      localClient?.on('session_delete', () => signOut())
      setClient(localClient)
    }
    createClient()
  }, [])

  useEffect(() => {
    async function createSession() {
      if (!client) {
        throw new Error('WC client not found.')
      }

      const { uri, approval } = await client.connect({
        requiredNamespaces: {
          [chainName || '']: {
            chains: [chainId],
            events: ['polkadot_event_test'],
            methods: ['sign_message'],
          },
        },
      })
      if (uri) {
        setQRUri(uri)
      }
      const localSession = await approval()

      if (localSession) {
        setWcSession(localSession)
      }
    }

    if (client) {
      if (
        session &&
        session.data &&
        client.session.values &&
        client.session.values.length > 0 &&
        client.session.values[0] &&
        session.data.user &&
        session.data.user.topic &&
        client.session.values[0].topic === session.data.user.topic
      ) {
        const localSession = client.session.get(session.data.user.topic)
        setWcSession(localSession)
      } else {
        createSession()
      }
    }
  }, [client, session, wcSession])

  useEffect(() => {
    if (wcSession && session?.status === 'unauthenticated') {
      const account = Object.values(wcSession.namespaces)
        .map((namespace: SessionTypes.Namespace) => namespace.accounts)
        .flat()[0]
      const walletId = account ? account.split(':')[2] : ''

      if (walletId) {
        signIn('ternoa-wallet', {
          walletId,
          topic: wcSession.topic,
        })
      }
    }
  }, [wcSession, session])

  return (
    <WCClientCtx.Provider value={client}>
      <WCQRLinkCtx.Provider value={QRUri}>
        <OpenQrModal.Provider value={setIsModalOpen}>
          {children}
          <Modal title="Connect your Ternoa wallet" isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
            <QRCode uri={QRUri ?? ''} />
          </Modal>
        </OpenQrModal.Provider>
      </WCQRLinkCtx.Provider>
    </WCClientCtx.Provider>
  )
}

export default WCProvider
