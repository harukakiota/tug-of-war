var socket = io();

// connection handler
socket.on('connect', function() {
	socket.emit('client');
    socket.emit('new player', socket.id);
});

var resp;

// listener for control keys, each pressing calls for end game check
document.addEventListener('keyup', function(event) {
switch (event.keyCode) {
    case 65: // A
    case 37:
    socket.emit('left', socket.id);
    break;
    case 68: // D
    case 39:
    socket.emit('right', socket.id);
    break;
}
});

// basic drawing element init
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
var window = this.window;

// if the game has ended => alert, reset
socket.on('end handler', function(has_ended){
    flag = has_ended;
    if (flag == -1) {
        window.alert('Красные победили!');
    } else if (flag
        == 1) {
        window.alert('Синие победили!');
    };
});

// screen redrawing, current player colored gray
socket.on('update', function(data) {
    rope_offset = data.rope_offset;
    players = data.players;
    context.clearRect(0, 0, 800, 600);
    context.beginPath();
    context.strokeStyle = 'black';
    context.moveTo(400, 0);
    context.setLineDash([8, 8]);
    context.lineWidth = 1;
    context.lineTo(400, 600);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'olive';
    context.lineWidth = 8;
    context.moveTo(rope_offset + 200, 300);
    context.lineTo(rope_offset + 600, 300);
    context.setLineDash([]);
    context.stroke();

    for (var id in players) {
        var player = players[id];
        if (id == socket.id) {
            context.beginPath();
            context.fillStyle = 'dimgray';
            context.fillRect(player.x + rope_offset,player.y - 5,6,10);
        } else {
            context.beginPath();
            context.fillStyle = player.side;
            context.fillRect(player.x + rope_offset,player.y - 5,6,10);
        };
    };
});
