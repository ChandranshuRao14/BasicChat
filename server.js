var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const port = 8080;
var router = express.Router();  

app.use('/', router);

var welcome = {
    data: "welcome to the BasicChatAPI"
};

var obj = {
    data: [{"name": "song1"}]
};

server.listen(port, () => 
    console.log(`BasicChat Server listening on port ${port}...`)
);

router.get('/', (req, res) => {
    res.json(welcome);
});

router.route('/rooms')
    .get((req, res) => {
        res.json(obj);
    });

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('songs', function(data){
        console.log(data);
        obj.data.push({name: data});
        client.emit('queue', data);
        client.broadcast.emit('queue', data);
    });
});
