import type { NextAuthOptions } from 'next-auth'
import NextAuth, { Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'ternoa-wallet',
      name: 'Ternoa Wallet',
      type: 'credentials',
      credentials: {
        walletId: {
          label: 'Ternoa Wallet ID',
          type: 'text',
          placeholder: 'Ternoa wallet id',
        },
        topic: {
          label: 'Walletconnect topic',
          type: 'text',
          placeholder: 'WC Topic',
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.walletId) return null
        const { walletId, topic } = credentials

        let user = null
        user = {
          id: walletId,
          walletId,
          topic,
        }

        return user
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days for Walletconnect session expiracy.
  },
  callbacks: {
    async signIn() {
      return true
    },
    async redirect({ url }) {
      return url
    },
    async session({ session, token }) {
      const localUser = token.user
      const mfSession: Session = {
        ...session,
        user: localUser,
      }
      return mfSession
    },
  },
}

export default NextAuth(authOptions)
