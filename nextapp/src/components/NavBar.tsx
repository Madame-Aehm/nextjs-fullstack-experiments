'use client'
import Link from 'next/link'
import React from 'react'
import { signOut } from 'next-auth/react'
import { useAuth } from './context/UserContext'


const NavBar = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Link href={"/"}>Home</Link>
      <Link href={"/api/graphql"}>GraphQL Explorer</Link>
      { user ? <>
        <Link href={"/chat"}>Chat</Link>
        <Link href={"/profile"}>Profile</Link>
        <button onClick={() => signOut()}>Logout</button>
      </> : <>
        <Link href={"/login"} >Login</Link>
        <Link href={"/signup"} >Sign Up</Link>
      </>}
    </div>
  )
}

export default NavBar