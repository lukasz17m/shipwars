const express = require('express')
const log = require('npmlog')
const path = require('path')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const PORT = 3000
const FPS = 10

let queue = []

let frame = {
  ships: {},
  balls: {}
}

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  log.info('CONNECT', 'User connected. ID: %s', socket.id)

  /*frame.ships[socket.id] = {
    x: Math.floor((Math.random() * 600) + 100),
    y: Math.floor((Math.random() * 400) + 100)
  }

  log.info('FRAME', frame)*/

  socket.on('login', (name, callback) => {
    log.info('LOGIN', 'User %s logged in.', name)
    callback('test')
  })

  // Disconnect
  socket.on('disconnect', () => {
    log.info('DISCONNECT', 'User disconnected. ID: %s', socket.id)
    delete frame.ships[socket.id]
    log.info('FRAME', frame)
  })
})

let timer = 0
;(function loop() {

  io.emit('frame', frame)

  if (timer < 3) setTimeout(loop, 1000 / FPS)

})()

http.listen(PORT, () => {
   log.info('OK', 'App listening on %i', PORT)
})