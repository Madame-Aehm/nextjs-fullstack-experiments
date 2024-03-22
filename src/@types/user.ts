import { ObjectId } from "mongoose"

export type ContextUser = {
  email: string
  username: string
  _id: string
  password: string
  pets: string[]
}
export type User = {
  email: string
  username: string
  _id: string | ObjectId
}

export type signUpValues = {
  signUpValues: {
    email: string
    username: string
    password: string
  }
}

export type updatableValues = { 
  updatableValues: { 
    email?: string 
    username?: string 
    password?: string 
  }
}

export type loginValues = {
  loginValues: {
    email: string
    password: string
  }
}