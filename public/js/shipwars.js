const socket = io()

socket.on('frame', (data) => {
	console.log(data.loop, (Date.now() % 60000) - data.time + ' ms')
})