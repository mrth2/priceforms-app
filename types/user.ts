export interface IUser {
  id: string
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  isOwner: boolean
  ownedForms?: string[]
}