const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config()

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (roomId) => {
    try {
      socket.join(roomId);
      console.log(`user with id-${socket.id} joined room - ${roomId}`);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("leave_room", (roomId) => {
    try {
      socket.leave(roomId);
      console.log(`user with id left room`)
    } catch (error) {
      console.log(error);
    }
  })

  socket.on("send_msg", (data) => {
    console.log("DATA", data);
    try {
      //This will send a message to a specific room ID
      socket.to(data.chatId).emit("receive_msg", data);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});