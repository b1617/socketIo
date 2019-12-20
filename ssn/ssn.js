"use strict";
/**
 * Object Ssn
 */
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var Promise = require("bluebird");
var fetch = require('node-fetch');
var url = "https://geo.api.gouv.fr";
var axios = require('axios');
var Ssn = /** @class */ (function () {
    function Ssn(secu) {
        this.secu_number = secu;
    }
    // ------------------------------------------------------------------------------------------------------------
    // VALIDITY STUFF
    // ------------------------------------------------------------------------------------------------------------
    Ssn.prototype.isValid = function () {
        // ---- is Valid if enough char and key ok
        return this.controlSsnValue() && this.controlSsnKey();
    };
    /**
     * Private function to check value
     */
    Ssn.prototype.controlSsnValue = function () {
        var regExpSsn = new RegExp("^" +
            "([1-37-8])" +
            "([0-9]{2})" +
            "(0[0-9]|[2-35-9][0-9]|[14][0-2])" +
            "((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))" +
            "(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})" +
            "(0[1-9]|[1-8][0-9]|9[0-7])$");
        return regExpSsn.test(this.secu_number);
    };
    /**
     * Private function to check NIR
     */
    Ssn.prototype.controlSsnKey = function () {
        // -- Extract classic information
        var myValue = this.secu_number.substr(0, 13);
        var myNir = this.secu_number.substr(13);
        // -- replace special value like corsica
        myValue.replace('2B', "18").replace("2A", "19");
        // -- transform as number
        var myNumber = +myValue;
        return (97 - (myNumber % 97) == +myNir);
    };
    // ------------------------------------------------------------------------------------------------------------
    // INFO STUFF
    // ------------------------------------------------------------------------------------------------------------
    Ssn.prototype.getInfo = function () {
        return {
            sex: this.extractSex(),
            birthDate: this.extractbirthDate(),
            birthPlace: this.extractBirthPlace(),
            birthPosition: this.extractPosition()
        };
    };
    /**
     *
     */
    Ssn.prototype.extractSex = function () {
        var sex = this.secu_number.substr(0, 1);
        return sex == "1" || sex == "3" || sex == "8" ? "Homme" : "Femme";
    };
    /**
     *
     */
    Ssn.prototype.extractbirthDate = function () {
        // -- Build a date
        var month = +this.secu_number.substr(3, 2);
        // -- special case
        if (month == 62 || month == 63) {
            month = 1;
        }
        var birth = new Date(+this.secu_number.substr(1, 2), month);
        return birth;
    };
    /**
     *
     */
    Ssn.prototype.extractBirthPlace = function () {
        var dept = +this.secu_number.substr(5, 2);
        var commune_insee = dept + this.secu_number.substr(7, 3);
        // --- Case DOM TOM
        if (dept == 97 || dept == 98) {
            request(url + '/departements/' + dept, function (err, res, body) {
                var json = JSON.parse(body);
                console.log("json_nom" + json["nom"]);
            });
            return {
                dept: this.secu_number.substr(5, 3),
                commune: this.secu_number.substr(8, 2),
            };
        }
        else if (dept == 99) {
            return {
                dept: "Etranger",
                pays: this.secu_number.substr(7, 3)
            };
        }
        else {
            return {
                dept: this.secu_number.substr(5, 2),
                commune: commune_insee,
            };
        }
    };
    /**
     *
     */
    Ssn.prototype.extractPosition = function () {
        return +this.secu_number.substr(10, 3);
    };
    Ssn.prototype.requestUrl = function (dept) {
        return new Promise(function (resolve, reject) {
            axios.get(url + '/departements/' + dept).then(function (response) {
                console.log("response", response.data["nom"]);
                resolve(response.data);
            });
        });
    };
    return Ssn;
}());
exports.Ssn = Ssn;
module.exports = Ssn;
