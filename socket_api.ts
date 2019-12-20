import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const app = express();
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname,'index.html'))
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on('connection', function(socket){

    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });


    socket.on('message', function(message){
        //console.log(message);
        io.emit('cool', message);
        socket.emit('cool', message);
    });

    socket.broadcast.emit('hi');

});

const server = http.listen(3000, function() {
    console.log("listening on *:3000");
});