// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5676);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// starting server
server.listen(5676, function() {
  console.log('Starting server on port 5676');
});

var service;

// all-incomes handler
io.on('connection', function(socket) {

  // when service wants to join, add it
  socket.on('service', function() {
		service = socket;
		console.log('add service');
	});

  // when clients want to join, add them
  socket.on('client', function() {
		socket.join('clients');
		console.log('add client');
	});

  // new client = new player handler - call service
  socket.on('new player', function(id, fn) {
    service.emit('new player', id, function() {
        if(fn) fn();
    });
  });

  // when single pressing of right arrow or 'A' was catched - call service
  socket.on('right', function(id, fn) {
    service.emit('right', id, function(has_ended) {
      io.sockets.in('clients').emit('end handler', has_ended);
    });
  });

  // when single pressing of left arrow or 'D' was catched - call service
  socket.on('left', function(id, fn) {
    service.emit('left', id, function(has_ended){
     io.sockets.in('clients').emit('end handler', has_ended);
    });
  });

  // pushing updates to all clients
  socket.on('update', function(data) {
		io.sockets.in('clients').emit('update', data);
	});

  // when client disconnects we need to stop serving him - call service
  socket.on('disconnect', function(id, fn) {
    socket.leave('clients');
		service.emit('disconnect', id, function(){
      if(fn) fn();
    });
  });

});

