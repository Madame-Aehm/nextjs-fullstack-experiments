"use client"
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { User } from "@/@types/user";
import { generateChatRoomId } from "@/utils/generateRoomId";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SavedMessage } from "@/@types/message";

type Props =  { 
  socket: Socket
  me: User
  otherUser: User
}

interface IMsgDataTypes {
  chatId: string;
  sent: string;
  message: string;
}

interface MessageType {
  _id: string
  chatId: string
  sent: User
  message: string
  createdAt: string
}

const ChatMessages = ({ socket, me, otherUser }:Props) => {

  const chatId = generateChatRoomId(me._id.toString(), otherUser._id.toString());
  const [inputValue, setInputValue] = useState('');

  const GETMESSAGES = gql`
    query Query($chatId: String!) {
      messages(chatId: $chatId) {
        _id
        chatId
        createdAt
        message
        sent {
          username
          email
          _id
        }
      }
    }
  `
  const { data, error, loading, refetch: refetchMessages } = useQuery<{ messages: SavedMessage[] }>(GETMESSAGES, { 
    variables: { 
      chatId
    }
  });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (data?.messages) setMessages(data.messages);
  }, [data]);


  const SENDMESSAGE = gql`
    mutation sendMessage($messageValues: messageValues!) {
      sendMessage(messageValues: $messageValues) {
        _id
        chatId
        sent {
          _id
          email
        }
        message
        createdAt
      }
    }
  `
  const [sendMessage, { loading: msgLoading, error: msgError }] = useMutation<{ sendMessage: MessageType }>(SENDMESSAGE, {
    variables: {
      messageValues: {
        chatId,
        sent: me._id.toString(),
        message: inputValue,
      }
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO why is message value not saving to db
    console.log("would send this", inputValue)
    if (inputValue) {
      const result = await sendMessage();
      if (result.data?.sendMessage) {
        console.log("result from API", result);
        socket.emit("send_msg", result.data.sendMessage);
        setMessages((prev) => [...prev, result.data.sendMessage]);
        setInputValue("");
      }
      // refetchMessages();
    }
  };


  useEffect(() => {
    socket.on("receive_msg", (data: MessageType) => {
      console.log("result from socket", data);
      setMessages((prev) => [...prev, data]);
    });
  }, [socket]);

  // useEffect(() => {
  //   const fetchMessagesInterval = setInterval(async() => {
  //     await refetchMessages();
  //   }, 2000);

  //   return () => clearInterval(fetchMessagesInterval);
  // }, [])

  if (loading) return <p>Loading....</p>
  return (
    <div style={{ 
      border: "solid black 1px", 
      padding: "1rem", 
      minHeight: "75vh", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between",
      overflow: "hidden" }}>
      <h1>You are chatting with { otherUser.username }</h1>
      <hr style={{ width: "100%" }}></hr>
      <div style={{ height: "56vh", overflow: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "1rem" }}>
        { messages && messages.map((msg, i) => {
          return <div
            key={`msg${i}`}
            style={{ 
              textAlign: msg.sent._id == me._id ? "right" : "left", 
              alignSelf:  msg.sent._id == me._id ? "flex-end" : "flex-start",
              padding: "0.5rem", 
              border: "solid black 1px", 
              borderRadius: "0.5rem", 
              maxWidth: "80%" 
            }}>
            <span>
              <b>{ msg.sent.username }</b>
              <i> { msg.createdAt }</i>
            </span>
            <div>
              { msg.message }
            </div>
          </div>
        })}
      </div>
      <hr style={{ width: "100%" }}></hr>
        <div style={{ textAlign: "center" }}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              id="textInput"
              placeholder="Type your message.."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">{ msgLoading ? "Sending..." : "Send" }</button>
          </form>
          { msgError?.message || error?.message && <p style={{ color: "red" }}>{ msgError.message }{ error.message }</p> }
        </div>
    </div>
  );
};

export default ChatMessages;