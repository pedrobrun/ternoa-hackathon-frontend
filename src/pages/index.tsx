import Head from 'next/head'
import { transferNft, WaitUntil, createNft } from 'ternoa-js'

import { useWalletConnectClient } from '@/utils/wallet-connect/provider'

export default function Home() {
  const { connect, disconnect, account, client, session, keyring, isInitializing } =
    useWalletConnectClient()

  const mintNft = async () => {
    if (keyring) {
      try {
        const nftData = await createNft(
          'Ternoa Hackathon claimed NFT',
          0,
          undefined,
          false,
          keyring as any,
          WaitUntil.BlockInclusion,
        )
        console.log('The on-chain NFT id is: ', nftData.nftId)
        return nftData.nftId
      } catch (e) {
        console.error(e)
      }
    }
    return null
  }

  const sendNft = async (nftId: number, recipientAddress: string) => {
    if (keyring) {
      try {
        const nftData = await transferNft(
          nftId,
          recipientAddress,
          keyring as any,
          WaitUntil.BlockInclusion,
        )
        console.log(`NFT ${nftData.nftId} transferred`)
      } catch (e) {
        console.error(e)
      }
    }
    return null
  }

  const claimNft = async () => {
    if (session && account && client) {
      console.log('will mint')
      const mintedNftId = await mintNft()
      console.log('minted', mintedNftId)
      if (mintedNftId) {
        const transferedNft = await sendNft(mintedNftId, account)
        console.log('transferednft', transferNft)
      }
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

      {!isInitializing ? (
        <main className="mb-[219px] mx-[16px]">
          <div className="flex mt-[80px] font-bold flex-col justify-center items-center xl:px-[163px] rounded-[20px] xl:pt-[75px] xl:pb-[97px] px-[31px] pb-[43px] pt-[60px] bg-opacity-40 bg-black mx-[16px]">
            <div className="max-w-[300px] text-center flex flex-col">
              <div className="text-[32px]">Claim your</div>
              <div className="text-[40px] -mt-5">NFTs daily!</div>
            </div>

            {client && account ? (
              <div className="flex flex-col w-full justify-center items-center">
                <button
                  onClick={claimNft}
                  className="w-[299px] xl:w-[470px] mt-[44px] h-[54px] bg-gradient-to-r rounded-[12px] via-[#CB06ED] via-[#FF0062] from-[#004FFF] to-[#FF8500] text-[16px] font-bold"
                >
                  Claim NFT 🎁
                </button>
                <button
                  className="mt-[59px] border-2 border-[#7898F1] rounded-[12px] px-[30px] py-[15px] font-bold text-[16px]"
                  onClick={() => disconnect()}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect()}
                className="w-[299px] xl:w-[470px] mt-[44px] h-[54px] bg-gradient-to-r rounded-[12px] via-[#CB06ED] via-[#FF0062] from-[#004FFF] to-[#FF8500] text-[16px] font-bold"
              >
                Connect your Ternoa Wallet
              </button>
            )}
          </div>
        </main>
      ) : null}
    </>
  )
}
