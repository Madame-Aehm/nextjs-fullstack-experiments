import React from 'react'
import getActiveUser from '@/utils/getActiveUser.ts'
import { redirect } from 'next/navigation';

const page = async() => {
  const user = await getActiveUser();
  if (!user) redirect("/login");
  return (
    <div>private route</div>
  )
}

export default page