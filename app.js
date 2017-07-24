const express = require('express')
const log = require('npmlog')
const path = require('path')
const sio = require('socket.io')

const app = express()
const http = require('http').Server(app);
const io = sio(http);

const PORT = 3000
const FPS = 60

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  let timer = 0
  ;(function loop() {
    socket.emit('frame', { loop: ++timer, time: Date.now() % 60000 })
    if (timer < 100) setTimeout(loop, 1000 / FPS)
  })()
})

http.listen(PORT, () => {
   log.info('OK', 'App listening on %i', PORT)
})