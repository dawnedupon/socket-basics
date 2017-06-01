var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//Sends current users to provided socket
function sendCurrentUsers(socket) {
  var info = clientInfo[socket.id];
  var users = [];

  if (typeof info === 'undefined') {
    return;
  }

  Object.keys(clientInfo).forEach(function(socketId) {
    var userInfo = clientInfo[socketId];

    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Currently in this room: ' + users.join(', '),
    timestamp: moment().valueOf()
  });
}

io.on('connection', function(socket) {
  console.log('User connected via socket.io!');

  //User disconnects
  socket.on('disconnect', function() {
    var userData = clientInfo[socket.id];

    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      io.to(userData.room).emit('message', {
        name: 'System',
        text: userData.name + ' has left this room.',
        timestamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

  //Users joins room
  socket.on('joinRoom', function(req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    //sends to everyone in that room but the current socket
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined this room.',
      timestamp: moment().valueOf()
    });
  });

  socket.on('message', function(message) {
    console.log('Message received: ' + message.text);

    if (message.text === '@meow') {
      sendCurrentUsers(socket);
    } else {
      message.timestamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message', message);
    }
  });

  //two arguments: event name, data to send
  socket.emit('message', {
    name: 'System',
    text: 'Hello! Welcome to CatRoulette.',
    timestamp: moment().valueOf()
  });

});

http.listen(PORT, function() {
  console.log('Server started!');
});
