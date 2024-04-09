import { User } from '@/@types/user';
import ProfileCC from '@/components/ProfileCC';
import dbConnect from '@/lib/connectDB';
import UserModal from '@/models/user';
import { getServerSession } from 'next-auth'
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
  const session = await getServerSession();
  if (!session) redirect("/login");
  await dbConnect();
  const user = await UserModal.findOne({ email: session.user.email }).lean() as User;
  if (!user) {
    signOut();
    redirect("/login");
  }
  user._id = user._id.toString();
  return (
    <div>
      <ProfileCC currentUser={user} />
    </div>
  )
}

export default page