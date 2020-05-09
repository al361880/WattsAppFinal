//Estructura JSON
//User {id:String, name:String, address:String, email:String, passwd:String, rateId:String, token:String}
//Device {id: String, state: String, location: String, type: String, description: String}


//Estructura Listas
//Users {idUser : {User}}
//Devices {idUser : {idDevice: {Device}, idDevice: {Device}}, ...}
//Rates = {idRate: {Rate}}
	    
		

//Listado de usuarios
let Users = [
    {"@context": ["http://schema.org/", {"oos": "http://our_own_schema.org"}], 
    "@type": "Person", 
    "@id":"http://our_own_schema.org/user/1", 
    "identifier": 11, 
    "name":"Ferran", 
    "address":"Castellon", 
    "email":"ferran@gmail.com", 
    "accessCode":"patata", 
    "oos:rate":"http://our_own_schema.org/rate/1", 
    "oos:token":"dgare"},

    {"@context": ["http://schema.org/", {"oos": "http://our_own_schema.org"}], 
    "@type": "Person", 
    "@id":"http://our_own_schema.org/user/2", 
    "identifier": 12, 
    "name":"Adrian", 
    "address":"Morella", 
    "email":"ferran@gmail.com", 
    "accessCode":"patata", 
    "oos:rate":"http://our_own_schema.org/rate/1", 
    "oos:token":"dcare"}
]

//Listado de dispositivos
let Devices =  [
    {"@context": ["http://schema.org/", {"oos": "http://our_own_schema.org"}], 
    "@type": "Product", 
    "@id": "http://our_own_schema.org/device/lav", 
    "oos:owner" : "http://our_own_schema.org/user/1",
    "identifier": "lav",
    "itemCondition": "Activo", 
    "location": "Cocina", 
    "category": "Electrodomestico", 
    "description":"Lavadora"},

    {"@context": ["http://schema.org/", {"oos": "http://our_own_schema.org"}], 
    "@type": "Product", 
    "@id": "http://our_own_schema.org/device/sec", 
    "oos:owner" : "http://our_own_schema.org/user/1",
    "identifier": "sec",
    "itemCondition": "Activo", 
    "location": "Comedor", 
    "category": "Refrigeracion", 
    "description":"Secadora"},

    {"@context": ["http://schema.org/", {"oos": "http://our_own_schema.org"}], 
    "@type": "Product", 
    "@id": "http://our_own_schema.org/device/lav2", 
    "oos:owner" : "http://our_own_schema.org/user/2",
    "identifier": "lav2",
    "itemCondition": "Activo", 
    "location": "Cocina", 
    "category": "Electrodomestico", 
    "description":"Lavadora"}
]

let Rates = [
    {"@context": "http://schema.org/",
    "@type": "Offer",
    "@id": "http://our_own_schema.org/rate/5",
    "identifier": 1,
    "name": "Basica",
    "price" : 50, 
    "description" : "BASICA"},

    {"@context": "http://schema.org/",
    "@type": "Offer",
    "@id": "http://our_own_schema.org/rate/5",
    "identifier": 2,
    "name": "Extra",
    "price" : 30, 
    "description" : "EXTRA"},


]
