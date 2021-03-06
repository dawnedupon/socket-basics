var name = getQueryVariable('name') || 'Anon';
var room = getQueryVariable('room');
var socket = io();

//Update h1 tag in chat.html
jQuery('.room-name').text(room);

socket.on('connect', function() {
  console.log('Connected to socket.io server.');
  socket.emit('joinRoom', {
    name: name,
    room: room
  });
});

//Create new message block
socket.on('message', function(message) {
  var momentTimestamp = moment.utc(message.timestamp);
  var $message = jQuery('#messages');

  var container = jQuery('<div></div>');
  container.addClass('message');
  $message.append(container);

  var name = jQuery('<span></span>');
  name.addClass('name');
  name.html(message.name);
  container.append(name);

  var timestamp = jQuery('<span></span>');
  timestamp.addClass('timestamp');
  timestamp.html(momentTimestamp.local().format('h:mm a'));
  container.append(timestamp);

  var text = jQuery('<p></p>');
  text.addClass('message-text');
  text.html(message.text);
  container.append(text);

  //Scroll to bottom of #messages
  $("#messages").stop().animate({
    scrollTop: $("#messages")[0].scrollHeight
  }, 1000);
});

//Submit new message
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
