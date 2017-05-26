var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  console.log('User connected via socket.io!');

  socket.on('joinRoom', function(req) {
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

    message.timestamp = moment().valueOf();
    io.emit('message', message);
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
