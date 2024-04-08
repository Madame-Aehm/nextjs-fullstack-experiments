"use client"
import { User } from '@/@types/user'
import React, { useEffect, useState } from 'react'
import { socket } from '@/lib/socket'
import ChatMessages from './ChatMessages'
import { generateChatRoomId } from '@/utils/generateRoomId'
import { gql, useQuery } from '@apollo/client'


type Props = {
  user: User
  otherUsers: User[]
}


const Chat = ({ user, otherUsers }: Props) => {
  const [chatWithUser, setChatWithUser] = useState<null | User>(null);

  const handleJoin = (otherUser: User) => {
    const idsCombined = generateChatRoomId(user._id.toString(), otherUser._id.toString());
    if (chatWithUser) {
      socket.emit("leave_room", generateChatRoomId(user._id.toString(), chatWithUser._id.toString()))
    }
    socket.emit("join_room", idsCombined);
    setChatWithUser(otherUser);
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.5fr 3fr" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        { otherUsers.map((user) => {
          return (
            <button 
              key={user._id.toString()} 
              onClick={() => handleJoin(user)}
              style={{ margin: "0.5rem" }}>
                Chat with {user.username}
              </button>
          )
        }) }
      </div>
      <div>
        { chatWithUser && <ChatMessages socket={socket} me={user} otherUser={chatWithUser} /> }
      </div>
    </div>
  )
}

export default Chat