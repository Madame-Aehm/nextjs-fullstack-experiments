import { ObjectId } from "mongoose"

export type User = {
  email: string
  username: string
  _id: string | ObjectId
  authType: string
  picture: {
    url: string,
    public_id?: string
  }
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
    email: string 
    username: string 
    picture: string
  }
}

export type loginValues = {
  loginValues: {
    email: string
    password: string
  }
}