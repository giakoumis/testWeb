var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlarmStatusSchema = new Schema({
	name:String,
	status:{type:Boolean,default:false}


});

module.exports= mongoose.model('AlarmStatus',AlarmStatusSchema);