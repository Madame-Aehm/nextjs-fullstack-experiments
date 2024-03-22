import Profile from '@/components/Profile';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
  const session = await getServerSession();
  // if (!session) redirect("/login");
  console.log(session)
  return (
    <div>
      testing profile
      {/* <Profile session={session} /> */}
    </div>
  )
}

export default page