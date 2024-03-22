import LogOutButton from '@/components/LogOutButton';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import React from 'react'

async function page() {
  const session = await getServerSession();
  console.log("session from page", session);

  return (
    <div>
      <div>
        <h1>Next-Auth Page</h1>
        <p>{ session ? "Session exists" : "No sesson" }</p>

        <LogOutButton />
      </div>
    </div>
  )
}

export default page