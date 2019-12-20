let SSN_MODULE = require('../mouhamad_faizan/ssn');
let pays_json = require('../_supports/pays');
// --- Base de donnees
let mongoose = require('mongoose');

let database  = mongoose.connect("mongodb://localhost/demo",{
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true
});

// ---- Creation du schema
//--- Module dependencies
const Schema	= mongoose.Schema;

//-- Resources Schema
let person = new Schema({
    id : String,
    lastName    : String,
    birthName    : String,
    SSN : {
        pays : String,
        dep : String,
        commune : String
    }
});

person.statics.createPerson = function(data){
    return new Promise((resolve, reject) => {
        let ssn = new SSN_MODULE(data.SSN);
        if(ssn.isValid()){
            let ssn_info = ssn.getInfo();
            let newPeople = {
                lastName: data.lastName,
                birthName: data.birthName,
                SSN: {
                    pays: ssn_info['birthPlace']['dept'] === "Etranger" ? pays_json[ssn_info['birthPlace']['pays']] : "France",
                    dep: ssn_info['birthPlace']['dept'],
                    commune: ssn_info['birthPlace']['commune']
                }
            };
            resolve(newPeople);
        }
        reject({SSN : "non valide"});


    })
}


mongoose.model('People', person);

module.exports = person;