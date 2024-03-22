"use client"
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

type Props = {}

const LogOutButton = (props: Props) => {
  const session = useSession();
  console.log("client session", session);

  return session.status === "authenticated" && <button onClick={() => signOut()}>Log out</button>
}

export default LogOutButton