var socket = io();

socket.on('connect', function() {
  console.log('Connected to socket.io server.');
});

socket.on('message', function(message) {
  console.log('New message:');
  console.log(message.text);
});

//Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
  //preventDefault is used on a form when you don't want to refresh the entire page
  //we want to handle form submission on our own
  event.preventDefault();

  var $message = $form.find('input[name=message]');

  socket.emit('message', {
    text: $message.val()
  });

  //Delete the value after sending it
  $message.val('');

});
