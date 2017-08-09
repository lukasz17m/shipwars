'use strict'

const express = require('express')
const log = require('npmlog')
const path = require('path')
const redis = require('redis')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const client = redis.createClient()

const CONFIG = require('./src/js/shipwars/Config.js')
const PORT = 3000
const FPS = 1
const MAX_PLAYERS = 4

let queue = []

let frame = {
  ships: {},
  balls: {}
}

app.use(express.static(path.join(__dirname, 'public')))

client.on('connect', () => client.del('ranking', (error, response) => {
  if (error) log.error('REDIS:DEL', error)
  log.info('REDIS:DEL', response)
}))

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

    // Send info message to all users
    io.emit('info', `${ name } connected`)

    // Send new queue to all users
    io.emit('queue', queue.map((queued) => { return queued.name }))

    log.info('FRAME', frame)
  })

  // Gets ['player1', 'player2'] returns ['#4008a4', '#95fc45']
  socket.on('getColors', (players, callback) => {
    callback(players.map((player) => {
      return frame.ships[Object.keys(frame.ships).find((key) => { return frame.ships[key].name == player })].color
    }))
  })

  // Joining the game
  socket.on('join', () => {
    frame.ships[socket.id] = {
      name: queue[Object.keys(queue).find((key) => { return queue[key].id == socket.id })].name,
      color: Math.floor(Math.random() * 16777215).toString(16),
      x: Math.floor((Math.random() * 600) + 100),
      y: Math.floor((Math.random() * 400) + 100)
    }

    client.zadd(['ranking', 0, frame.ships[socket.id].name], (error, response) => {
      if (error) log.error('REDIS:ZADD', error)
      log.info('REDIS:ZADD', response)
      getRanking()
    })

    function getRanking() {
      client.zrevrange(['ranking', 0, -1, 'WITHSCORES'], (error, response) => {
        if (error) log.error('REDIS:ZREVRANGE', error)
        log.info('REDIS:ZREVRANGE', response)

        socket.emit('ranking', response)
      })
    }
  })

  // Disconnect
  socket.on('disconnect', () => {
    log.info('DISCONNECT', 'User disconnected. ID: %s', socket.id)

    let name = null

    // Remove player from game or queue
    if (frame.ships.hasOwnProperty(socket.id)) {
      name = frame.ships[socket.id].name // not done yet
      delete frame.ships[socket.id]
    } else {
      queue = queue.filter((queued) => {
        log.info('FILTER', 'queued: %s <> socket: %s', queued.id, socket.id)
        
        if (queued.id == socket.id) {
          name = queued.name
          return false
        }
        return true
      })
    }

    // Send info message to all users
    io.emit('info', `${ name } disconnected`)

    // Send new queue to all users
    io.emit('queue', queue.map((queued) => { return queued.name }))

    log.info('FRAME', frame)
  })

  // temp
  socket.on('redis', (data) => {
    if (data.member) {
      // temp
      frame.ships['hardcoded-socket.io:ID#' + data.member] = { name: data.member, color: '#' + Math.floor(Math.random()*16777215).toString(16) }

      client.zadd(['ranking', 0, data.member], (error, response) => {
        if (error) log.error('REDIS:ZADD', error)
        log.info('REDIS:ZADD', response)
        getRanking()
      })
    }

    if (data.incr) {
      client.zincrby(['ranking', 1, data.incr], (error, response) => {
        if (error) log.error('REDIS:ZINCRBY', error)
        log.info('REDIS:ZINCRBY', response)
        getRanking()
      })
    }

    function getRanking() {
      client.zrevrange(['ranking', 0, -1, 'WITHSCORES'], (error, response) => {
        if (error) log.error('REDIS:ZREVRANGE', error)
        log.info('REDIS:ZREVRANGE', response)

        socket.emit('ranking', response)
      })
    }
  })
})

let timer = 0
;(function loop() {

  io.emit('frame', frame)

  if (timer < 3) setTimeout(loop, 1000 / FPS)

})()

http.listen(PORT, () => log.http('OK', 'App listening on %i', PORT))
