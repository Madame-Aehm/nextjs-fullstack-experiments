import { User } from '@/@types/user';
import dbConnect from '@/lib/connectDB';
import UserModal from '@/models/user';
import React from 'react'

type Props = {}

const UsersSC = async(props: Props) => {
  await dbConnect();
  const users = await UserModal.find({}) as User[];

  return (
    <div style={{ border: "solid black 1px", padding: "0 1rem" }}>
      <h3>This is a Server Component</h3>
      <ul>
        { users.map((user) => {
          return <li key={user._id.toString()}>{user.email}</li>
        }) }
      </ul>
    </div>
  )
}

export default UsersSC