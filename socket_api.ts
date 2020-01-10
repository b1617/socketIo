import * as express from "express";
import * as path from "path";
import *  as Person from "./ssn/model.js";

let ssnModule = require('./ssn/ssn.js');
const app = express();
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on('connection', function (socket) {
    let user = {"firstName": null, "lastName": null, "SSN": null};
    let count_question = 0;
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.emit('out', "Bonjour, Quel est votre prenom ?");
    socket.on('in', function (result) {
        socket.emit('out', result);
        if (count_question === 0) {
            user.firstName = result;
            socket.emit('out', user.firstName + ", quel est votre nom ?");
            count_question++;
        } else if (count_question === 1) {
            user.lastName = result;
            socket.emit('out', user.firstName + ' ' + user.lastName + ", quel est votre ssn ?");
            count_question++;
        }  else if (count_question === 2) {
            let ssn_test = new ssnModule(result);
            if (!ssn_test.isValid()) {
                socket.emit('out', "Ce ssn est invalide veuillez saisir un ssn existant !");
            } else {
                user.SSN = result;
                socket.emit('out', user.firstName + ' ' + user.lastName + ', ceci est votre ssn : ' + user.SSN);
                console.log("count", count_question);
                Person.find({number_ssn:user.SSN}).then((result_ssn)=>{
                if(result_ssn.length == 0){
                        socket.emit('out', 'Vous êtes pas dans la base. Désirez-vous insérer vos données dans la base ? (oui/non)');
                        count_question++;
                }else{
                    socket.emit('out', 'êtes-vous bien : '+result_ssn);
                    count_question=4;
                }
                console.log("SSN" + result)},
                (err)=>{
                }
            );
              //  count_question++;

            }

        } else if (count_question === 3) {
                if (result.toLowerCase() === 'oui') {
                                //Utiliser le post de l'api que l'on a créé et lui passer les données de User.
                                Person.createPerson(user).then((person) => {
                                    new Person(person).save().then((result) => {
                                        socket.emit('out', 'Vous êtes bien inscrit ' + result.toString());
                                        socket.emit('out', 'Bye ' + user.firstName);
                                        count_question++;
                                        //socket.disconnect();
                                    }, (err) => {
                                        socket.emit('out', 'Inscription impossible ' + err);
                                    });
                                }).catch((err) => {
                                    socket.emit('out', 'Inscription impossible ' + err);
                                });

                            } else if (result.toLowerCase() === 'non') {
                                //déconnecter le user (fermer la socket ?)
                                //socket.disconnect()
                            } else {
                                socket.emit('out', 'Veuillez répondre par oui ou non');
                            }
        }


        else if(count_question === 4){
            if (result.toLowerCase() === 'oui') {
                                    socket.emit('out', 'Ok tant mieux !');
                                    count_question++;
            } else if (result.toLowerCase() === 'non') {
                                    socket.emit('out', 'Veuillez contacter M.Breda');
                                    count_question++;
            }else{
                                socket.emit('out', 'Veuillez répondre par oui ou non');
            }

        }


    });
});

const server = http.listen(3000, function () {
    console.log("listening on *:3000");
});
