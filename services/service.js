// dependencies
var io = require('socket.io-client');
var socket = io.connect('http://localhost:5676');

// status-carrying variables
var players = {};
var rope_offset = 0;

// utility functiong
var sumPlayersByType = function(dict, type){
        var sum = 0;
        console.log(dict);
        if (!(Object.keys(dict).length === 0)) {
            for(var key in dict) {
            if(dict[key].side == type) {
                sum += 1;
            }
            }
        };
        return sum;
    };

// check if one of the teams won
var checkEnd = function(roff) {
	if (roff > 200) {
        rope_offset = 0;
		return 1;
    } else if (roff < -200){
        rope_offset = 0;
        return -1;
    } else {
        return 0;
    };
};

// connecting to gateway
socket.on('connect', function() {
	console.log('Connected to gateway');
    players = {};
    rope_offset = 0;
	socket.emit('service');
});

// when single pressing of left arrow or 'D' was catched - implementation
socket.on('left', function(id, fn) {
    var player = players[id] || {};
	if (player.side == 'red') {
		rope_offset -= 2;
		}
		else {
		rope_offset = -201; // auto-win for the team red if some client isn't playing for his team
    }
	fn(checkEnd(rope_offset));
});

// when single pressing of right arrow or 'A' was catched - implementation
socket.on('right', function(id, fn) {
    var player = players[id] || {};
	if (player.side == 'blue') {
		rope_offset += 2;
		}
		else {
		rope_offset = 201; // auto-win for the team blue if some client isn't playing for his team
		}
	fn(checkEnd(rope_offset));
});

// new player handler implementation
socket.on('new player', function(id, fn) {
    console.log(players);
    if (sumPlayersByType(players,'blue') >= sumPlayersByType(players,'red')) {
        players[id] = {
            x: 192 - sumPlayersByType(players,'red') * 8, // offset, isn't coords
            y: 300,
            side: 'red'
        };
        }
    else {
        players[id] = {
            x: 602 + sumPlayersByType(players,'blue') * 8, // offset, isn't coords
            y: 300,
            side: 'blue'
        };
    };
    console.log(players);
    if (fn) fn();
});

// disconnect handler
socket.on('disconnect', function(id, fn) {
    delete players[id];
    if(fn) fn();
});

// 60 requests per second for screen update
setInterval(function() {
    data = {rope_offset: rope_offset, players: players};
	socket.emit('update', data);
    data = {};
}, 1000 / 60);