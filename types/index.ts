export interface User {
  walletId: string
  balance: string
  topic: string
  isWhitelisted: boolean
  genListDiscount?: number
}
