const bodyparser = require('body-parser')
const express = require('express')
const control = require('./controllers')

const app = express() //API Main object
 
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

app.use(control.middleware)

app.use('/web', express.static('public'))

app.get('/events', control.init)

//Users
app.get('/users', control.getUsers)

app.get('/user', control.getUserData )

app.post('/user', control.createUser )

app.delete('/user/:id', control.deleteUser)

//Autentication
app.post('/login', control.login)

app.get('/logout', control.logout)


//Devices
app.post('/device/:id',  control.createDevice)

app.get('/device/:id',  control.getDeviceData)

app.get('/device/list/:id',  control.getDevices)


//Rates
app.post('/rate', control.createRate ) 

app.get('/user/:id/rate', control.getRateData ) 

app.get('/rate',  control.getRates)
//app.get('/rates',  control.getRates)
//app.get('/rate/:id',  control.getRate)

app.delete('/rate/:id', control.deleteRate)

const PORT = 8080
app.listen(PORT, _ => console.log(`Servidor web escuchando en puerto ${PORT}`))


