import Image from 'next/image'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

interface IQRCode {
  uri: string
}

const QRCode = ({ uri }: IQRCode) => (
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
)

export default QRCode
