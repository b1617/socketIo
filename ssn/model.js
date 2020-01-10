// --- Base de donnees

let request = require('request');
let paysJson = require('../_supports/pays');
let mongoose = require('mongoose');
let ssnHelper = require('./ssn');
let database = mongoose.connect("mongodb://127.0.0.1/td3", {
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true
});
let URL = "https://geo.api.gouv.fr";
// ---- Creation du schema
//--- Module dependencies
const Schema = mongoose.Schema;

//-- Resources Schema
let personSchema = new Schema({
    id: String,
    lastName: String,
    firstName: String,
    number_ssn : String,
    SSN: {
        departement: String,
        pays: String,
        commune: String
    },
});

personSchema.statics.createPerson = function (data) {
    return new Promise((resolve, reject) => {
        let ssn = new ssnHelper(data['SSN']);
        if (ssn.isValid()) {
            let ssnInfo = ssn.getInfo();
            if (ssnInfo['birthPlace']['dept'] !== 'Etranger') {
                request(URL + '/communes/' + ssnInfo['birthPlace']['dept'], (error, response, body) => {
                    if (!error) {
                        resolve([JSON.parse(body), ssnInfo, data]);
                    } else {
                        reject(error);
                    }
                });
            }
            resolve([ssnInfo, data]);
        } else {
            console.log('reject');
            reject({SSN: 'Invalid'})
        }
    }).then((res) => {
        // console.log('first 1', res);
        return new Promise(((resolve, reject) => {
            if (res[0]['birthPlace']['dept'] !== 'Etranger') {
                request(URL + '/communes/' + res[1]['birthPlace']['dept'] + res[1]['birthPlace']['commune'], (error, response, body) => {
                    if (!error) {
                        res.push(JSON.parse(body));
                        console.log(res);
                        resolve(res);
                    } else {
                        reject(error);
                    }
                });
            }
            resolve(res);
        }));
    }).then((res) => {
        //console.log('last', res);
        let dept, ssnInfo, data, commune;
        if (res.length > 2) {
            dept = res[0];
            ssnInfo = res[1];
            data = res[2];
            commune = res[3];
        } else {
            ssnInfo = res[0];
            data = res[1];
        }
        return {
            lastName: data['lastName'],
            firstName: data['firstName'],
            number_ssn: data['SSN'],
            SSN: {
                departement: ssnInfo['birthPlace']['dept'] !== 'Etranger' ? dept['nom'] : null,
                pays: ssnInfo['birthPlace']['dept'] !== 'Etranger' ? 'France' : paysJson[ssnInfo['birthPlace']['pays']],
                commune: ssnInfo['birthPlace']['dept'] !== 'Etranger' ? commune['nom'] : null
            }
        };
    });
};

module.exports = mongoose.model('Person', personSchema);
//module.exports = personSchema;
