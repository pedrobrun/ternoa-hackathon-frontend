import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment, Dispatch } from 'react'

import Ternoa from 'public/logos/ternoa.svg'
import XIcon from 'public/logos/x.svg'

interface IModal {
  title?: string
  children: JSX.Element
  isOpen: boolean
  setIsOpen: Dispatch<boolean>
}

const Modal = ({ children, isOpen, setIsOpen }: IModal) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-[100]" onClose={() => setIsOpen(!isOpen)}>
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
                <Image
                  className="cursor-pointer"
                  src={XIcon}
                  alt="x icon"
                  onClick={() => {
                    setIsOpen(false)
                  }}
                />
              </div>
              <div>{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
)

export default Modal
