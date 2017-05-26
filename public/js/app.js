var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

socket.on('connect', function() {
  console.log('Connected to socket.io server.');
});

socket.on('message', function(message) {
  var momentTimestamp = moment.utc(message.timestamp);
  var $message = jQuery('.messages');

  console.log('New message:');
  console.log(message.text);

  $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>')
  $message.append('<p>' + message.text + '</p>');
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
