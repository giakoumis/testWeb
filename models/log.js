var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
	type:String,
	message:String,
	picture:String,
	date:{type:Date,default:Date.now}

});

module.exports = mongoose.model('Log', LogSchema);