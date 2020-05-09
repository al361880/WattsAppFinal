//Users		{id: String, name: String, address: String, email: String, passwd: String, rateId: String, token: String}
//{"al1":{id:"al1",name:"Juan",address:"uji",email:"aaaa",passwd:"papa",rateId:'1',token:"dgare"}}
//DeviceData	{id: String, state: String, location: String, type: String ,description: String}
/*{
	"al1":{
			"vitro":{id:"vitro", state:"Activo", location:"Cocina", type:"Electrodomestico", description:"Vitroceramica"},
	       "lav":{id:"lav", state:"Activo", location:"Cocina", type:"Electrodomestico", description:"Lavadora"},
			"mic":{id:"mic", state:"Desconectado", location:"Baño", type:"Electrodomestico", description:"Microondas"}
	},
	
	"al2":{
			"vitro2":{id:"vitro2", state:"Activo", location:"Cocina", type:"Electrodomestico", description:"Vitroceramica"},
	       "lav2":{id:"lav2", state:"Activo", location:"Cocina", type:"Electrodomestico", description:"Lavadora"},
			"mic2":{id:"mic2", state:"Desconectado", location:"Baño", type:"Electrodomestico", description:"Microondas"}
	},

}
*/

//RateData		{id: String, name: String, price: double, description: String}

		
//curl -i -X POST -H "Content-Type: application/json" -d "{ \"id\": \"id3\", \"name\": \"Pepe\" , \"address\": \"uji\", \"email\": \"test@inventado.com\" , \"passwd\": \"efaiou\" , \"rateId\": \"2\" , \"token\": \"ofigirfegelhheg\"}"  http://localhost:8000/user
//curl -i -X DELETE -H "Content-Type: application/json" -d "{ \"id\": \"al2\"}" http://localhost:8000/user

//curl -i -X POST -H "Content-Type: application/json" -d "{ \"id\": \"sec\", \"state\": \"Activo\" , \"location\": \"Cocina\", \"type\": \"Electrodomestico\" , \"description\": \"Secadora\"}"  http://localhost:8000/device


//curl -i -X POST -H "Content-Type: application/json" -d "{ \"id\": \"3\", \"name\": \"Reducida\" , \"price\": 6.8 ,\"description\": \"Tarifa reducida\"}"  http://localhost:8000/rate
//curl -i -X DELETE -H "Content-Type: application/json"  http://localhost:8000/rates

const schema = require('./schemas')
const tokenController = require('./tokenJWT.js')

const Rate = schema.Rate;
const User = schema.User;
const Device = schema.Device;


const contexts = ["http://schema.org/", {"oos": "http://our_own_schema.org"}];

const infoDevice = {"@context": contexts , "@type": "Product"};
const infoUser = {"@context": contexts , "@type": "User"};
const infoRate = {"@context": contexts , "@type": "Offer"};
//Anyadir, modificar, ver usuario

const addInfo = (data, info) => {
	data = JSON.parse(JSON.stringify(data))
 	Object.assign(data, info);
	return data;
}

/*
async function getIdByToken(token) {
	return await new Promise((resolve, reject) => {
		User.findOne({'oos:token':token}).then(data => {
			resolve(data["@id"])
		});
	});
}
*/
exports.login = data =>{
	return  new Promise((resolve, reject) => {
		User.findOne({'email':data.email, 'accesCode':data.accesCode}).then(d => {

			if (d == null){
				resolve('KO')

			}else{
				//resto
				tokenController.createToken(d["@id"]).then(token => {
					var res = {identifier: d.identifier, "@id": d["@id"], name: d.name, token: token}
					resolve(res)
				})
			}
		});
	});
}


exports.createUser = (data, STREAM) => { 
	return new Promise((resolve, reject) => {
		var id = data.date + Math.floor(Math.random() * 10000000000000);
		//check if data is valid
		if (!data.identifier ||!data.email || !data.name || !data.accessCode || !data.address)
			return 'KO'
		
		var user = new User({
			
			"@id":"http://our_own_schema.org/user/" + data.identifier, 
			"identifier": data.identifier, 
			"name":data.name, 
			"address":data.address, 
			"email":data.email, 
			"accessCode":data.accessCode, 
			"oos:rate":"http://our_own_schema.org/rate/" + data.rateId
		});

		//var existe=User.findOne({ 'identifier': data.id}); // Realizas la busqueda en la DB para cada objeto sino existe, entonces lo inserta
		User.find({'identifier':data.identifier}, function (err, docs) {
			if (docs.length){
				const filter = {'identifier':data.identifier};
				 
				//User.findOneAndUpdate(filter, update);
				User.updateOne(filter,data).then(()=>{
					resolve('OK')
				}).catch(()=>{
					resolve('KO')
				});
			}else{
				user.save().then(()=>{
					STREAM.send(JSON.stringify(data), 'updates')
					resolve('OK')
				}).catch(()=>{
					resolve('KO')
				});
			}
		});
	});
}
//exports.getUsers = () => Object.keys(Users).map(k => ( {id:Users[k].id, name: Users[k].name, email: Users[k].email, address: Users[k].address, rateId: Users[k].rateId, token: Users[k].token}) )

exports.getUsers = () => {
	return new Promise((resolve, reject)=>{
		User.find().then(data =>{
			//resolve(addInfo(data, infoUser))
			var res = data.map(k => ({identifier: k.identifier, name: k.name,address: k.address, email: k.email,'oos:rate':k['oos:rate'].replace("http://our_own_schema.org/rate/", "")}))
				resolve(addInfo(res,infoUser))
		});
	});
}

exports.getUserData = userId => {
	return new Promise((resolve, reject)=>{
		User.findOne({'identifier':userId}).then(data =>{
			resolve(addInfo(data,infoUser))
		});
	});
}

exports.deleteUser = userId =>{
	return new Promise((resolve, reject) => {
		User.deleteOne({'identifier':userId})
			.then(data => {
				if (data.deletedCount == 0) {
					resolve("KO");
				} else {
					resolve("OK")
				}
			}).catch((err)=>{
				console.log(err);
			 });
	});
}

//login, logout

exports.logout = data => { 
    //check if data is valid
	//Users[data.id].token = ''
	return 'OK'
}

//Anyadir, modificar dispositivo

exports.createDevice = (data, id ,STREAM) => { 

	return new Promise((resolve, reject) => {

		//check if data is valid
		if (!data.identifier ||!data.itemCondition || !data.location || !data.category || !data.description)
			return 'KO'

		var device = new Device({
			
			"@id": "http://our_own_schema.org/device/" +  data.identifier, 
			"identifier": data.identifier, 
			"oos:owner" : "http://our_own_schema.org/user/" + id,
			"itemCondition": data.itemCondition,
			"location": data.location,
			"category": data.category,
			"description": data.description
		});

		Device.find({'identifier':data.identifier}, function (err, docs) {
			if (docs.length){
				const filter = {'identifier':data.identifier, 'oos:owner' : "http://our_own_schema.org/user/" + id};
					
				//User.findOneAndUpdate(filter, update);
				Device.updateOne(filter,data).then(()=>{
					resolve('OK')
				}).catch(()=>{
					resolve('KO')
				});
			}else{
				device.save().then(()=>{
					STREAM.send(JSON.stringify(data), 'updateDevices')
					resolve('OK')
				}).catch(()=>{
					resolve('KO')
				});
			}
		});
	});
}

exports.getDeviceData = id => {
	return new Promise((resolve, reject)=>{
		Device.findOne({'identifier':id}).then(data =>{
			resolve(addInfo(data,infoDevice))
		});
	});
}

//exports.getDeviceData = id => Devices[id] || null
exports.getDevices = id => {
	return new Promise((resolve, reject) => {
		Device.find({'oos:owner': 'http://our_own_schema.org/user/' + id}).then(data => {
			resolve(addInfo(data,infoDevice))
		});
	});
}

//crear, modificar y ver tarifa usuario

exports.createRate = (data, STREAM) => {

	return new Promise((resolve, reject) => {
		//check if data is valid
		if (!data.identifier ||!data.name || !data.price || !data.description)
			return 'KO'

		var rate = new Rate({
			
			"@id": "http://our_own_schema.org/rate/" + data.identifier, 
			"identifier": data.identifier, 
			"name" : data.name,
			"price": data.price,
			"description": data.description
		});

		Rate.find({'identifier':data.identifier}, function (err, docs) {
			if (docs.length){
				const filter = {'identifier':data.identifier};

				Rate.updateOne(filter,data).then(()=>{
					resolve('OK')
				}).catch(()=>{
					resolve('KO')
				});
			}else{
				rate.save().then(() => {
					STREAM.send(JSON.stringify(data), 'updateRates')
					resolve('OK')
				}).catch(() => {
					resolve('KO')
				});
			}
		});
	});
}

exports.getRateData = userId => {
	return new Promise((resolve, reject)=>{
		User.findOne({'identifier':userId}).then(data =>{
			resolve(addInfo(data,infoRate))
		});
	});
}


exports.getRate = rateId => {
	return new Promise((resolve, reject)=>{
		Rate.findOne({'identifier':rateId}).then(data=>{
			resolve(addInfo(data, infoRate))
		});
	});
}

//exports.getRates = () => Object.keys(Rates).map(k => ({id: Rates[k].id, name: Rates[k].name, price: Rates[k].price, description: Rates[k].description}) )

exports.getRates = () => {
	return new Promise((resolve, reject)=>{
		Rate.find().then(data =>{
			var res = data.map(k => ({identifier: k.identifier, name: k.name, price: k.price, description: k.description}))
			resolve(addInfo(res, infoRate))
		});
	});
}

exports.deleteRate = rateId =>{
	
	return new Promise((resolve, reject) => {
		Rate.deleteOne({'identifier':rateId})
			.then(data => {
				if (data.deletedCount == 0) {
					resolve("KO");
				} else {
					resolve("OK")
				}
			})
	});
}
