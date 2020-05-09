const schema = require('./schemas')

const Rate = schema.Rate;
const User = schema.User;
const Device = schema.Device;
 
var rate = new Rate({
     "@id": "http://our_own_schema.org/rate/1",
     "identifier": 1,
     "name": "Basica",
     "price" : 50, 
     "description" : "BASICA"   
 });

var rate2 = new Rate({
     "@id": "http://our_own_schema.org/rate/2",
     "identifier": 2,
     "name": "Extra",
     "price" : 30, 
     "description" : "EXTRA"   
 });
 rate.save().then(() => rate2.save())
  	.catch(err => console.log('Error!', err))

 var user = new User({
     "@context":[],
     "@type":"",
 	"@id":"http://our_own_schema.org/user/11", 
     "identifier": 11, 
     "name":"Ferran", 
     "address":"Castellon", 
     "email":"ferran@gmail.com", 
     "accessCode":"patata", 
     "oos:rate":"http://our_own_schema.org/rate/2",
     "oos:token":"dgare"
 });

 var user2 = new User({
     "@context":[],
     "@type":"",
 	"@id":"http://our_own_schema.org/user/12", 
     "identifier": 12, 
     "name":"Adrian", 
     "address":"Morella", 
     "email":"adrian@gmail.com", 
     "accessCode":"patata", 
     "oos:rate":"http://our_own_schema.org/rate/1",
     "oos:token":"dcare"
 });


 user.save().catch(err => console.log('Error!', err))
 user2.save().catch(err => console.log('Error!', err))


var device = new Device({
    "@context":[],
    "@type":"",
	"@id": "http://our_own_schema.org/device/lav", 
    "oos:owner" : "http://our_own_schema.org/user/11",
    "identifier": "lav",
    "itemCondition": "Activo", 
    "location": "Cocina", 
    "category": "Electrodomestico", 
    "description":"Lavadora"
});

var device2 = new Device({
    "@context":[],
    "@type":"",
	"@id": "http://our_own_schema.org/device/sec", 
    "oos:owner" : "http://our_own_schema.org/user/11",
    "identifier": "sec",
    "itemCondition": "Activo", 
    "location": "Comedor", 
    "category": "Refrigeracion", 
    "description":"Secadora"
});

var device3 = new Device({
    "@context":[],
    "@type":"",
	"@id": "http://our_own_schema.org/device/lav2", 
    "oos:owner" : "http://our_own_schema.org/user/12",
    "identifier": "lav2",
    "itemCondition": "Activo", 
    "location": "Cocina", 
    "category": "Electrodomestico", 
    "description":"Lavadora"
});

device.save().then(() => device2.save().then(() => device3.save()))
.catch(err => console.log('Error!', err))
