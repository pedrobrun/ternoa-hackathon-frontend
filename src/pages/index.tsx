import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useContext } from 'react'

import { OpenQrModal, WCClientCtx, WCQRLinkCtx } from '@/utils/wallet-connect/provider'

export default function Home() {
  const client = useContext(WCClientCtx)
  const session = useSession()
  const openModal = useContext(OpenQrModal)
  const uri = useContext(WCQRLinkCtx)
  const handleModal = () => {
    const { isRNApp } = window
    if (isRNApp) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ data: uri, action: 'WC_PAIR' }))
    } else if (openModal && typeof openModal === 'function') {
      openModal(true)
    }
  }
  return (
    <>
      <Head>
        <title>Ternoa Treasure Hunt</title>
        <meta name="description" content="Ternoa Treasure Hunt for Paris Blockchain Week 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mb-[219px] mx-[16px]">
        <div className="flex mt-[80px] font-bold flex-col justify-center items-center xl:px-[163px] rounded-[20px] xl:pt-[75px] xl:pb-[97px] px-[31px] pb-[43px] pt-[60px] bg-opacity-40 bg-black mx-[16px]">
          <div className="max-w-[300px] text-center flex flex-col">
            <div className="text-[32px]">Claim your</div>
            <div className="text-[40px] -mt-5">NFTs daily!</div>
          </div>

          {session.status === 'authenticated' ? (
            <div className="flex w-full justify-center items-center">
              <button
                className="mt-[59px] border-2 border-[#7898F1] rounded-[12px] px-[30px] py-[15px] font-bold text-[16px]"
                onClick={() => {
                  signOut()
                  client?.disconnect({
                    topic: session?.data?.user?.topic,
                    reason: { code: 400, message: 'User signed out.' },
                  })
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleModal}
              className="w-[299px] xl:w-[470px] mt-[44px] h-[54px] bg-gradient-to-r rounded-[12px] via-[#CB06ED] via-[#FF0062] from-[#004FFF] to-[#FF8500] text-[16px] font-bold"
            >
              Connect your Ternoa Wallet
            </button>
          )}
        </div>
      </main>
    </>
  )
}
