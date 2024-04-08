import { io } from "socket.io-client";

const url = "http://localhost:3001"

export const socket = io(url, {
  autoConnect: false
});