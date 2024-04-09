import Chat from '@/components/ChatMain';
import dbConnect from '@/lib/connectDB';
import UserModal from '@/models/user';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
  const session = await getServerSession();
  if (!session) redirect("/login");
  await dbConnect();
  const user = await UserModal.findOne({ email: session.user.email }).select("-password");
  const otherUsers = await UserModal.find({ email: { $ne: session.user.email } }).select("-password");

  return (
    <div>
      <h1>Chat</h1>
      <Chat user={JSON.parse(JSON.stringify(user))} otherUsers={JSON.parse(JSON.stringify(otherUsers))} />
    </div>
  )
}

export default page