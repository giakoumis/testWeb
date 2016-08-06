var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntryPointSchema = new Schema({
	name:String,
	secure:{type:Boolean,default:false}

});

module.exports = mongoose.model('EntryPoint', EntryPointSchema);