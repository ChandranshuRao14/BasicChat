var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const port = 4200;
var router = express.Router();  

app.use('/api', router);
app.use(cors());

var welcome = {
    data: "welcome to the ProjectAuxAPI"
};

var obj = {
    data: [{"name": "song1"}]
};

server.listen(port, () => 
    console.log(`Server listening on port ${port}...`)
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
