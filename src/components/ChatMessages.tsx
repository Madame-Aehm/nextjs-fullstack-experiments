"use client"
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { User } from "@/@types/user";
import { generateChatRoomId } from "@/utils/generateRoomId";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SavedMessage } from "@/@types/message";
import { text } from "stream/consumers";

type Props =  { 
  socket: Socket
  me: User
  otherUser: User
}

interface IMsgDataTypes {
  chatId: string;
  sent: string;
  message: string;
  createdAt?: string
}

const ChatMessages = ({ socket, me, otherUser }:Props) => {

  const chatId = generateChatRoomId(me._id.toString(), otherUser._id.toString());
  const inputValue = useRef("");

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
  const { data, error, loading, refetch } = useQuery<{ messages: SavedMessage[] }>(GETMESSAGES, { 
    variables: { 
      chatId
    }
  });
  const messages = data?.messages;
  console.log(data, error, loading);

  const SENDMESSAGE = gql`
    mutation sendMessage($messageValues: messageValues!) {
      sendMessage(messageValues: $messageValues)
    }
  `
  const [sendMessage, { data: msgData, loading: msgLoading, error: msgError }] = useMutation(SENDMESSAGE, {
    variables: {
      messageValues: {
        chatId,
        sent: me._id.toString(),
        message: inputValue.current,
      }
    }
  })

  console.log(msgData, msgLoading, msgError);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO why is message value not saving to db
    console.log("would send this", inputValue.current)
    if (inputValue.current !== "") {
      const success = await sendMessage();
      const msgData: IMsgDataTypes = {
        chatId,
        sent: me._id.toString(),
        message: inputValue.current,
      };
      socket.emit("send_msg", msgData);
      inputValue.current = "";
      const textInput = document.getElementById("textInput") as HTMLInputElement;
      textInput!.value = "";
      refetch();
    }
  };


  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      // setMessages((prev) => [...prev, data]);
      refetch();
    });
  }, [socket]);


  return (
    <div style={{ border: "solid black 1px", padding: "1rem" }}>
      <div>
        <h1>You are chatting with { otherUser.username }</h1>
        <div>
          { messages && messages.map((msg, i) => (
            <div
              key={`msg${i}`}
              style={{ textAlign: msg.sent._id == me._id ? "right" : "left" }}>
              <span>
                <b>{ msg.sent.username }</b>
                <i> { msg.createdAt }</i>
              </span>
              <div>
                { msg.message }
              </div>
            </div>
          ))}
        </div>
        <hr></hr>
        <div style={{ textAlign: "center" }}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              id="textInput"
              placeholder="Type your message.."
              onChange={(e) => {
                console.log(e.target.value)
                inputValue.current = e.target.value
              }}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;