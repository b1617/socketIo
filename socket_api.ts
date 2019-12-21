import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import { isBuffer } from "util";


let ssn_module = require('./ssn/ssn.js');
//ssn_module = ssn_module.Ssn;
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

    let ssn_test;
    let user = {"person":{"prenom":"","nom":"","ssn":""}};
    let count_question=0;

    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.emit('hi');

    socket.on('message', function(result) {
        socket.emit('cool', result);
        if(count_question===0){
            user.person.prenom=result;
            socket.emit('ssn', user.person.prenom+", quel est votre nom ?");
            count_question++;
        }else if(count_question===1){
            user.person.nom=result;
            socket.emit('ssn', user.person.prenom+' '+user.person.nom+", quel est votre ssn ?");
            count_question++;
        }
        else if(count_question===2){
            ssn_test = new ssn_module(result);
            if(!ssn_test.isValid()){
                socket.emit('ssn', "Ce ssn est invalide veuillez saisir un ssn existant !");
            }
            else{
                user.person.ssn=result;
                socket.emit('ssn', user.person.prenom+' '+user.person.nom+', ceci est votre ssn : '+user.person.ssn);
                socket.emit('ssn','Désirez-vous insérer vos données dans la base ? (Oui/Non)');
                count_question++;
            }
        }
        else if(count_question===3){
            if(result==='Oui'){
                //Utiliser le post de l'api que l'on a créé et lui passer les données de User.
            }else if(result==='Non'){
                //déconnecter le user (fermer la socket ?)
            }else{
                socket.emit('ssn','Veuillez répondre par Oui ou Non');
            }

        }
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

const server = http.listen(3000, function() {
    console.log("listening on *:3000");
});