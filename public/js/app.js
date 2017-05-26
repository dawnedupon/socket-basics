var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room + '.');

//Update h1 tag .room-name
jQuery('.room-name').text(room);

socket.on('connect', function() {
  console.log('Connected to socket.io server.');
  socket.emit('joinRoom', {
    name: name,
    room: room
  });
});

socket.on('message', function(message) {
  var momentTimestamp = moment.utc(message.timestamp);
  var $message = jQuery('#messages');

  console.log('New message:');
  console.log(message.text);

  $message.append('<p>' + '<span class="name">' + message.name + ' </span>' + '<span class="timestamp">' + momentTimestamp.local().format('h:mm a') + '</span></p>')
  $message.append('<p class="message-text">' + message.text + '</p>');
});

//Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
  //preventDefault is used on a form when you don't want to refresh the entire page
  //we want to handle form submission on our own
  event.preventDefault();

  var $message = $form.find('input[name=message]');

  socket.emit('message', {
    name: name,
    text: $message.val()
  });

  //Delete the value from console after sending it
  $message.val('');

});

//Autoscroll to bottom of .messages
