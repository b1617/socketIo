import request = require("request");

export class Ssn {
    // -- Attribute definition

    private readonly secu_number: string;

    constructor(secu: string) {
        this.secu_number = secu;
    }

    public getssn(): string {
        return this.secu_number;
    }

    // ------------------------------------------------------------------------------------------------------------
    // VALIDITY STUFF
    // ------------------------------------------------------------------------------------------------------------
    public isValid(): boolean {
        // ---- is Valid if enough char and key ok
        return this.controlSsnValue() && this.controlSsnKey();
    }


    /**
     * Private function to check value
     */
    private controlSsnValue(): boolean {
        let regExpSsn = new RegExp("^" +
            "([1-37-8])" +
            "([0-9]{2})" +
            "(0[0-9]|[2-35-9][0-9]|[14][0-2])" +
            "((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))" +
            "(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})" +
            "(0[1-9]|[1-8][0-9]|9[0-7])$");

        return regExpSsn.test(this.secu_number);
    }

    /**
     * Private function to check NIR
     */
    private controlSsnKey(): boolean {
        // -- Extract classic information
        let myValue: string = this.secu_number.substr(0, 13);
        let myNir: string = this.secu_number.substr(13);
        // -- replace special value like corsica
        myValue.replace('2B', "18").replace("2A", "19");
        // -- transform as number
        let myNumber: number = +myValue;
        return (97 - (myNumber % 97) == +myNir)
    }

    // ------------------------------------------------------------------------------------------------------------
    // INFO STUFF
    // ------------------------------------------------------------------------------------------------------------
    public getInfo(): object {
        return {
            sex: this.extractSex(),
            birthDate: this.extractbirthDate(),
            birthPlace: this.extractBirthPlace(),
            birthPosition: this.extractPosition()
        }
    }

    /**
     *
     */
    private extractSex(): string {
        let sex: string = this.secu_number.substr(0, 1);
        return sex == "1" || sex == "3" || sex == "8" ? "Homme" : "Femme";
    }

    /**
     *
     */
    private extractbirthDate(): string {
        // -- Build a date
        let month = +this.secu_number.substr(3, 2);
        // -- special case
        if (month == 62 || month == 63) {
            month = 1
        }
        let birth: any = new Date(+this.secu_number.substr(1, 2), month);
        return birth
    }



    /**
     *
     */
    private extractBirthPlace(): object {

        let dept: number = +this.secu_number.substr(5, 2);
        if (dept == 97 || dept == 98) {
            return {
                dept: this.secu_number.substr(5, 3),
                commune: this.secu_number.substr(8, 2),
            }
        } else if (dept == 99) {
            return {
                dept: "Etranger",
                pays: this.secu_number.substr(7, 3)
            }
        } else {
            return {
                dept: this.secu_number.substr(5, 2),
                commune: this.secu_number.substr(7, 3),
            }
        }
    }

    /**
     *
     */
    private extractPosition(): number {
        return +this.secu_number.substr(10, 3)
    }
}

module.exports = Ssn;
