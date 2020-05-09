const mng = require('mongoose')
const my_conn_data = "mongodb+srv://usuario:practicas@wattsapp-m9bdm.mongodb.net/test?retryWrites=true&w=majority"
//mng.set('useFindAndModify', false);
mng.connect(my_conn_data, {useFindAndModify: false});

var rateSchema = new mng.Schema({

	"@id": String, 
	"identifier": Number,
	"name": String, 
	"price" : Number,
	"description" : String
});

var userSchema = new mng.Schema({

	"@id": String, 
	"identifier": Number, 
	"name": String, 
	"address": String, 
	"email": String, 
	"accessCode": String, 
	"oos:rate": {type: mng.Schema.Types.String, ref: 'Rate'},
	//"oos:token": String
});

var deviceSchema = new mng.Schema({
	
	"@id": String, 
	"identifier": Number, 
	"oos:owner": {type: mng.Schema.Types.String, ref: 'User'},
	// "oos:owner": {type: mng.Schema.Types.ObjectId, ref: 'User'},
	"itemCondition": String, 
	"location": String,  
	"category": String, 
	"description": String
});

var Rate = mng.model('Rate', rateSchema);
var User = mng.model('User', userSchema);
var Device = mng.model('Device', deviceSchema);

exports = module.exports = {Rate, User, Device}