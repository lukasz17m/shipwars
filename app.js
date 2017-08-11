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

let spectators = []

let colors = ['#865f1d', '#3a2d18', '#473b2f', '#6d3d22']

let frame = {
  ships: {},
  balls: {}
}

app.use(express.static(path.join(__dirname, 'public')))

// Checks if there’s enough colors
if (colors.length < CONFIG.MAX_PLAYERS) {
  log.warn('ATTENTION', 'You should have specified at least %d colors', CONFIG.MAX_PLAYERS)
}

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
    for (let i = 0; i < spectators.length; i++) {
      if (spectators[i].name == name) return abort()
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
    // Join spectators
    spectators.push({ id: socket.id, name })
    callback(true)
    // Send info message to all users
    io.emit('info', `${ name } connected`)
    // Send ranking only to new user
    getRanking(socket)
    // Update spectators
    updatespectators()
  })

  // Gets ['player1', 'player2'] returns ['#4008a4', '#95fc45']
  socket.on('getColors', (players, callback) => {
    callback(players.map((player) => {
      let id = Object.keys(frame.ships).find((key) => { return frame.ships[key].name == player })
      return (typeof frame.ships[id] == 'undefined') ? '#f00' : frame.ships[id].color
    }))
  })

  // Joining the game
  socket.on('join', (callback) => {
    // Checks if there’s slot available for another player
    if (Object.keys(frame.ships).length == CONFIG.MAX_PLAYERS) {
      callback(false)
      return false
    }
    // Adds player to frame
    frame.ships[socket.id] = {
      name: spectators[Object.keys(spectators).find((key) => { return spectators[key].id == socket.id })].name,
      color: drawColor(),
      x: Math.floor((Math.random() * 600) + 100),
      y: Math.floor((Math.random() * 400) + 100)
    }
    // Get new ranking
    client.zadd(['ranking', 0, frame.ships[socket.id].name], (error, response) => {
      if (error) log.error('REDIS:ZADD', error)
      log.info('REDIS:ZADD', response)
      getRanking()
    })
    // Update spectators
    spectators = spectators.filter((spectator) => {
      if (spectator.id == socket.id) {
        return false
      }
      return true
    })
    // Send info message to all users
    io.emit('info', `${ frame.ships[socket.id].name } is playing`)
    // Update spectators
    updatespectators()
    // Success
    callback(true)
  })

  // Leave the game
  socket.on('leave', () => {
    // Join spectators
    spectators.push({ id: socket.id, name: frame.ships[socket.id].name })
    // See this func below
    playerLeave(socket.id)
    // Update spectators
    updatespectators()
  })

  // Disconnect
  socket.on('disconnect', () => {
    log.info('DISCONNECT', 'User disconnected. ID: %s', socket.id)
    // Init name variable
    let name = null
    // Remove player from game or spectators
    if (frame.ships.hasOwnProperty(socket.id)) {
      name = frame.ships[socket.id].name
      playerLeave(socket.id)
    } else {
      spectators = spectators.filter((spectator) => {
        if (spectator.id == socket.id) {
          name = spectator.name
          return false
        }
        return true
      })
    }
    // Send info message to all users
    io.emit('info', `${ name } disconnected`)
    // Update spectators
    updatespectators()
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
  })
})

let timer = 0
;(function loop() {

  io.emit('frame', frame)

  if (timer < 3) setTimeout(loop, 1000 / FPS)

})()
// Listen for HTTP requests
http.listen(PORT, () => log.http('OK', 'App listening on %i', PORT))
// Utils
function getRanking(emiter = io) {
  client.zrevrange(['ranking', 0, -1, 'WITHSCORES'], (error, response) => {
    if (error) log.error('REDIS:ZREVRANGE', error)
    log.info('REDIS:ZREVRANGE', response)

    emiter.emit('ranking', response)
  })
}

function drawColor() {
  let i = Math.floor(Math.random() * colors.length)
  log.info('DRAWING', 'i: %d; length: %d', i, colors.length)
  return colors.splice(i, 1)[0]
}

function playerLeave(id) {
  // Gives color back
  colors.push(frame.ships[id].color)
  // Redis
  client.zrem(['ranking', frame.ships[id].name], (error, response) => {
    if (error) log.error('REDIS:ZADD', error)
    log.info('REDIS:ZADD', response)
    getRanking()
  })
  io.emit('info', `${ frame.ships[id].name } left the game`)
  delete frame.ships[id]
}

function updatespectators() {
  // Send new spectators to all users
  io.emit('spectators', spectators.map((spectator) => { return spectator.name }))
  // Disable or enable join option
  if (Object.keys(frame.ships).length === CONFIG.MAX_PLAYERS) {
    spectators.forEach((spectator) => {
      io.to(spectator.id).emit('private-state', 0)
    })
  } else {    
    spectators.forEach((spectator) => {
      io.to(spectator.id).emit('private-state', 1)
    })
  }
}