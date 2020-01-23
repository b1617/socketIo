let mongoose = require('mongoose');
const Schema = mongoose.Schema;
let historicSchema = new Schema({
    id: String,
    pseudo: String,
    historic: []
});

module.exports = mongoose.model('Historic', historicSchema);
