'use client'
import Link from 'next/link'
import React from 'react'
import { useAuth } from './UserContext'
import { signOut } from 'next-auth/react'

const NavBar = () => {
  const { user } = useAuth();
  console.log(user)
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Link href={"/"}>Home</Link>
      <Link href={"/api/graphql"}>GraphQL Explorer</Link>
      { user ? <>
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