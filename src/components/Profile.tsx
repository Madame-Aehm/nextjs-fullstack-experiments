import { Session } from 'next-auth'
import React from 'react'

type Props = {
  session: Session
}

const Profile = (props: Props) => {
  console.log(props.session)
  return (
    <div>
      <h1>Profile</h1>
      
    </div>
  )
}

export default Profile