import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { Fragment, Dispatch } from 'react'

import XIcon from 'public/logos/x.svg'

interface IConnectWalletModal {
  uri: string
  isModalOpen: boolean
  setIsModalOpen: Dispatch<boolean>
}

const ConnectWalletModal = ({ isModalOpen, setIsModalOpen, uri }: IConnectWalletModal) => {
  async function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-80" />
        </Transition.Child>

        <div className="fixed inset-0 mt-14 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="border-primary max-w-5xl transform overflow-hidden rounded-lg border-2 border-[#191939] bg-black p-[39px] transition-all">
                <div className="justify-end flex items-start">
                  <Image className="cursor-pointer" src={XIcon} alt="x icon" onClick={closeModal} />
                </div>
                <div>
                  <div className="flex flex-col items-center justify-center pb-6 px-28">
                    <div className="font-bold text-4xl mt-2">Connect wallet</div>
                    <div className="justify-center flex items-center mt-5">
                      <div className="flex flex-col justify-between items-center py-5 text-center">
                        <div className="mt-4 h-fit w-fit self-center rounded-2xl border-8 border-white ">
                          <QRCodeSVG value={uri} size={160} />
                        </div>
                        <div className="text-[24px] font-bold mt-[16px]">Scan me !</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConnectWalletModal
