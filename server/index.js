const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const { Server } = require('socket.io');
const port = 8000;

const app = express();

const io = new Server({
    cors: true
});

app.use(bodyParser.json());
app.use(cors('*'))

const emailToSocketMapping = new Map();

io.on('connection', socket => {
    console.log("New Connection");
    socket.on("join-room", (data) => {
        const { emailId, roomId } = data;
        console.log("User:", emailId, "Joined Room:", roomId)
        emailToSocketMapping.set(emailId, socket.id);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-joined", { emailId })
    })
})

app.listen(port, () => {
    console.log(`Server is running on ${port} port`)
});

io.listen(8001);