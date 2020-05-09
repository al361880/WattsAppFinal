const Twitter = require('twitter')
const myCreds = require('./credentials/my-credential.json')

const client = new Twitter(myCreds)

let stream = client.stream('statuses/filter', {track: 'coches,opel,mercedes,bmw,seat,ford,citroen,peugeot'})

stream.on('data', tweet => {
  if (tweet.lang=="es" || tweet.user.lang=="en"){
     console.log(tweet.id_str,tweet.text)
     if (tweet.entities && tweet.entities.media)
         console.log("images:",tweet.entities.media.map(d => d.url))
  }
})

stream.on('error', err => console.log(err))

//Destruimos el stream despues de 20 segundos (solo para pruebas)
setTimeout( _ => stream.destroy(), 20000)
