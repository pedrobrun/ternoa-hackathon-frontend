import Client from '@walletconnect/sign-client'
import type { SessionTypes } from '@walletconnect/types'
import { ERROR, getAppMetadata } from '@walletconnect/utils'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { getKeyringFromSeed, initializeApi } from 'ternoa-js'

import ConnectWalletModal from '@/components/connectWalletModal'

const chainId = process.env['NEXT_PUBLIC_CHAIN_ID'] ?? 'ternoa:18bcdb75a0bba577b084878db2dc2546'
const relayUrl = process.env['NEXT_PUBLIC_RELAY_URL'] ?? 'wss://alphanet.ternoa.com'
const projectId = process.env['PROJECT_ID'] ?? 'a982a87b2c64a9c35d08a036abfbfc7e'
const name = process.env['NEXT_PUBLIC_PROJECT_NAME'] ?? 'Ternoa Hackathon - Claim your NFT daily'
const description =
  process.env['NEXT_PUBLIC_PROJECT_DESCRIPTION'] ?? 'Ternoa Hackathon - Claim your NFT daily'
const metadata = {
  name,
  description,
  url: getAppMetadata().url,
  icons: ['public/images/logo.png'],
}

interface IContext {
  client: Client | undefined
  session: SessionTypes.Struct | undefined
  connect: (pairing?: { topic: string }) => Promise<void>
  disconnect: () => Promise<void>
  isInitializing: boolean
  account: string | undefined
  keyring: Record<string, unknown> | undefined
}

export const ClientContext = createContext<IContext>({} as IContext)

export function ClientContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const router = useRouter()
  const [client, setClient] = useState<Client>()
  const [session, setSession] = useState<SessionTypes.Struct>()
  const [keyring, setKeyring] = useState<Record<string, unknown>>()

  const [isInitializing, setIsInitializing] = useState(false)

  const [account, setAccount] = useState<string>()
  const [QRUri, setQRUri] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const initApi = async () => {
      const ternoaWss = process.env['NEXT_PUBLIC_TERNOA_CHAIN_URL']
      const ternoaSeed = process.env['NEXT_PUBLIC_TERNOA_ACCOUNT_SEED']

      if (!ternoaWss || !ternoaSeed) {
        throw Error('Missing ternoa wss or seed')
      }

      await initializeApi(ternoaWss)
      const localKeyring = await getKeyringFromSeed(ternoaSeed)
      setKeyring(localKeyring as any)
    }
    initApi()
  }, [])

  const reset = () => {
    setSession(undefined)
    setAccount(undefined)
  }

  const onSessionConnected = useCallback(async (_session: SessionTypes.Struct) => {
    const acc = Object.values(_session.namespaces)
      .map((namespace) => namespace.accounts)
      .flat()[0]
    const walletId = acc?.split(':')[2]

    setSession(_session)
    setAccount(walletId)
  }, [])

  const connect = useCallback(
    async (pairing: any) => {
      if (typeof client === 'undefined') {
        throw new Error('WalletConnect is not initialized')
      }

      try {
        await initializeApi(process.env['NEXT_PUBLIC_TERNOA_CHAIN_URL'])

        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,
          requiredNamespaces: {
            ternoa: {
              chains: [chainId],
              events: ['polkadot_event_test'],
              methods: ['sign_message'],
            },
          },
        })

        // Use `uri` to display a QR Code modal to the user
        setQRUri(uri)
        setIsModalOpen(true)

        const sess = await approval()
        await onSessionConnected(sess)
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw Error(e.message)
        }
      } finally {
        // Close the QR Code modal
        setIsModalOpen(false)
      }
    },
    [client, onSessionConnected],
  )

  const disconnect = useCallback(async () => {
    if (typeof client === 'undefined') {
      throw new Error('WalletConnect is not initialized')
    }
    if (typeof session === 'undefined') {
      throw new Error('Session is not connected')
    }

    await client.disconnect({
      topic: session.topic,
      reason: ERROR.USER_DISCONNECTED.format(),
    })
    // Reset app state after disconnect.
    router.replace('/').finally(() => reset())
  }, [client, session, router])

  const subscribeToEvents = useCallback(
    async (_client: Client) => {
      if (typeof _client === 'undefined') {
        throw new Error('WalletConnect is not initialized')
      }

      _client.on('session_update', ({ topic, params }) => {
        const { namespaces } = params
        const sess = _client.session.get(topic)
        const updatedSession = { ...sess, namespaces }
        onSessionConnected(updatedSession)
      })

      _client.on('session_delete', () => {
        reset()
      })
    },
    [onSessionConnected],
  )

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true)

      const clnt = await Client.init({
        logger: process.env.NODE_ENV === 'development' ? 'debug' : 'silent',
        relayUrl,
        projectId,
        metadata,
      })

      await subscribeToEvents(clnt)
      setClient(clnt)
    } catch (e) {
      if (e instanceof Error) {
        throw Error(e.message)
      }
    } finally {
      setIsInitializing(false)
    }
  }, [subscribeToEvents])

  useEffect(() => {
    if (!client) {
      createClient()
    }
  }, [client, createClient])

  return (
    <ClientContext.Provider
      value={{
        isInitializing,
        account,
        client,
        session,
        disconnect,
        connect,
        keyring,
      }}
    >
      {children}
      <ConnectWalletModal
        uri={QRUri ?? ''}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </ClientContext.Provider>
  )
}

export function useWalletConnectClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useWalletConnectClient must be used within a ClientContextProvider')
  }
  return context
}
