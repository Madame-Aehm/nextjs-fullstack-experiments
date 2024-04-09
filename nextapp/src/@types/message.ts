import { User } from "./user"

export type SavedMessage = {
  _id: string
  sent: User
  message: string
  chatId: string
  createdAt: string
}

export type messageValuesType = {
  messageValues: {
    sent: string
    message: string
    chatId: string
  }
}