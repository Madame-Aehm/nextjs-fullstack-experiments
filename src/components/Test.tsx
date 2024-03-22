import { User } from '@/@types/user'
import React from 'react'

type Props = {
  user: User
}

const Test = ({ user }: Props) => {
  return (
    <div>
      <h2>This is a testing component</h2>
      <p>The current user is: { user.username }</p>
    </div>
  )
}

export default Test