import io from 'socket.io-client'

export default class Core {

	constructor() {
		this.io = io()
	}

	a() {
		alert('OKey')
	}

}