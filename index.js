const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const dotenv = require("dotenv");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messagess");
const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
} = require("./utils/users");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "./public");

app.use(express.static(publicDirectoryPath));

////built in event
io.on("connection", (socket) => {
  console.log("New Connection......");

  socket.on("join", ({ username, room }, cb) => {
    const { err, user } = addUser({ id: socket.id, username, room });
    if (err) {
      return cb(err);
    }
    socket.join(user.room);

    //send message to all newly connected user
    socket.emit(
      "message",
      generateMessage("Welcome " + user.username, user.username)
    );

    //when new user connected send message to others
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(`${user.username} has joined`, user.username)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    cb();
  });

  //on client send message
  socket.on("sendMessage", (message, cb) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return cb("Profane word not allow....");
    }
    io.to(user.room).emit("message", generateMessage(message, user.username));
    cb("Message deliverd");
  });

  //on send locaton by client
  socket.on("location", (lati, longg, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "LocationMessage",
      generateMessage(
        `https://www.google.co.in/maps/@${lati},${longg},10z`,
        user.username
      )
    );
    cb("Message deliverd");
  });

  //when user leaves others will get messsage
  //built in event
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left...`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUserInRoom(user.room),
      });
    }
  });
});

// server.listen(port, () => {
//   console.log(`Server is up on port ${port}!`);
// });
