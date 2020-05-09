const axios = require('axios')

let client = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 1000,
})

client.post("/user", {id:'pepe10', name: 'Jose Garcia' , email: 'pepe10@guachi.com', passwd: 'secret0'})
      .then(response => console.log(response.data))
      .catch(error => console.log(error))

client.post("/blog", {id:'motos', name: "Mundo Motos" , creatorID: "pepe10"})
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
