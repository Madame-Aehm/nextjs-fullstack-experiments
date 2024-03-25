import ProfileCC from '@/components/ProfileCC';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div>
      <ProfileCC />
    </div>
  )
}

export default page