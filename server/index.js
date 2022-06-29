const express = require('express');
const { Server } = require('socket.io');
const app = express();
const http = require("http");

const cors = require("cors");
app.use (cors());

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:"http://localhost:3000",
    },
});


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on ("send_message", (data) => {
        io.sockets.in(data.room).emit("receive_message", data);
    })

});

server.listen(3001, () => {
    console.log("Server is Running on 3001");
})

