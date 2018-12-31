var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const port = 8080;

app.use(express.static('public'));

server.listen(port, () => 
    console.log(`BasicChat Server listening on port ${port}...`)
);

app.get('/', (req, res) => {
    res.res.sendFile(__dirname + '/public/index.html')
});

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('messages', function(data){
        client.emit('thread', data);
        client.broadcast.emit('thread', data);
    });
});
