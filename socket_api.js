"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ssn_module = require('./ssn/ssn.js');
//ssn_module = ssn_module.Ssn;
var app = express();
app.set("port", process.env.PORT || 3000);
var http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
var io = require("socket.io")(http);
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on('connection', function (socket) {
    var ssn_test;
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.emit('hi');
    socket.on('message', function (result) {
        socket.emit('cool', result);
        //socket.emit('ssn', 'Coucou '+result);
        socket.emit('ssn', result + ", quel est ton nom ?");
    });
    /*socket.on('message', function(message){
        let msg = ['Prenom ?', 'SSN ?'];

        ssn_test  = new ssn_module(message);
        socket.person = {
            nom: "s",
            prenom: "s",
            ssn: ""
        }


        console.log(message);
        socket.emit('ssn', message);
        //socket.emit('cool', message + "socket");
        socket.emit('ssn', ssn_test.isValid());
    });*/
});
var server = http.listen(3000, function () {
    console.log("listening on *:3000");
});
