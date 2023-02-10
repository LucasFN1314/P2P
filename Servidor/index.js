const express = require('express')();
const http = require('http').createServer(express);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

let clients = [];
try {
    io.on('connection', (socket) => {
        socket.on('join', (data) => {
            data = JSON.parse(data);

            let username_index = clients.filter(client => client.username === data.username);
            if (username_index.length === 0) {
                socket.userID = data.userID;
                socket.username = data.username;
                socket.room = data.room;

                socket.join(data.room);
                clients.push(socket);

                console.log(`User (#${data.userID}) ${data.username} connected to ${data.room} room`);
                io.to(socket.room).emit('message', JSON.stringify({ message: `User (#${socket.userID}) ${socket.username} connected to ${socket.room} room` }));
            }
            else {
                socket.emit('message', JSON.stringify({ message: `Username #${data.username} is currently in use` }));
            }
        });

        socket.on('send-message', (data) => {
            data = JSON.parse(data);
            socket.broadcast.to(socket.room).emit('user-message', JSON.stringify({message:data.message, username:socket.username}));
        });

    });
} catch (error) {
    console.log(error);
}  
