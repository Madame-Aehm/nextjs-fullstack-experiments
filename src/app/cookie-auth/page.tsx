import React from 'react'
import getActiveUser from '@/utils/getActiveUser.ts'
import { redirect } from 'next/navigation';
import Test from '@/components/Test';

const page = async() => {
  const user = await getActiveUser();
  if (!user) redirect("/login");
  return <Test user={user} />
}

export default page