import Head from 'next/head'

interface ILayout {
  children: JSX.Element
}

const Layout = ({ children }: ILayout) => (
  <>
    <Head>
      <title>Ternoa Hackathon</title>
    </Head>
    <main className="bg-black flex-col relative text-white w-screen flex overflow-hidden items-center justify-center h-screen">
      <div className="z-30 relative">{children}</div>
    </main>
  </>
)

export default Layout
