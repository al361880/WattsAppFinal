const M = require('./model')
const tokenController = require('./tokenJWT.js')

const SSE = require('express-sse') //Server-side events


exports.middleware = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 
	           'Origin, Content-Type, Accept')
    res.header('Cache-Control', 'no-cache')

	if (req.url.startsWith("/login") || req.url.startsWith("/user") || req.url.startsWith("/device") || req.url.startsWith("/web") || req.url.startsWith("/favicon")|| req.url.startsWith("/events")){
		next()
	}else{
		tokenController.checkToken(req, res).then(result=>{
			req.body.userId = result.identifier;
			next();
		})
	}
	//console.log(req.url)
}

const STREAM = new SSE()

exports.init = (req, res) => STREAM.init(req, res)

//Users
exports.getUsers    = async (req, res) => res.send({result: await M.getUsers()})

exports.getUserData = async (req, res) => res.send({result: await M.getUserData(req.body.userId)})

exports.createUser  = async (req, res) => res.send({result: await M.createUser(req.body, STREAM)}) //POST

exports.deleteUser = async (req, res) => res.send({result: await M.deleteUser(req.params.id)})

//Autentication

exports.login    = async (req, res) => res.send({result: await M.login(req.body)})

exports.logout    = async (req, res) => res.send({result: await M.logout()})

//Devices
exports.createDevice  = async (req, res) => res.send({result: await M.createDevice(req.body, req.params.id, STREAM)}) //POST

exports.getDeviceData = async (req, res) => res.send({result: await M.getDeviceData(req.params.id)})

exports.getDevices    = async (req, res) => res.send({result: await M.getDevices(req.params.id)})


//Rates
exports.createRate  = async (req, res) => res.send({result: await M.createRate(req.body, STREAM)}) //POST

exports.getRateData = async (req, res) => res.send({result: await M.getRateData(req.params.id)})

exports.getRates    = async (req, res) => res.send({result: await M.getRates()})

//exports.getRate    = async (req, res) => res.send({result: await M.getRate(req.params.id)})

exports.deleteRate = async (req, res) => res.send({result: await M.deleteRate(req.params.id)})
