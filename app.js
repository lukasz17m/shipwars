'use strict'

const express = require('express')
const log = require('npmlog')
const path = require('path')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const CONFIG = require('./src/js/shipwars/Config.js')
const PORT = 3000
const FPS = 10
const MAX_PLAYERS = 4

let queue = []

let frame = {
  ships: {},
  balls: {},
  queue
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
    // Check nickname length on the backend    
    if (name.length < CONFIG.NAME_MIN_CHARS || name.length > CONFIG.NAME_MAX_CHARS) return abort()

    // Check if nickname is taken
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].name == name) return abort()
    }

    for (let player in frame.ships) {
      if (frame.ships[player].name == name) return abort()
    }

    // Send callback, disconnect user and cancel function
    function abort() {
        callback(false)
        socket.disconnect(true)
        return false
    }

    // Login user
    log.info('LOGIN', 'User %s logged in.', name)

    queue.push({ id: socket.id, name })

    callback(true)

    log.info('FRAME', frame)
  })

  // Disconnect
  socket.on('disconnect', () => {
    log.info('DISCONNECT', 'User disconnected. ID: %s', socket.id)

    // Remove player from game or queue
    if (frame.ships.hasOwnProperty(socket.id)) {
      delete frame.ships[socket.id]
    } else {
      frame.queue = queue = queue.filter((queued) => {
        log.info('FILTER', 'queued: %s <> socket: %s', queued.id, socket.id)
        if (queued.id == socket.id) {
          return false
        }
        return true
      })
    }

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