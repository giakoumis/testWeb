var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PassSchema = new Schema({
	pass:String

});

module.exports = mongoose.model('Password', PassSchema);