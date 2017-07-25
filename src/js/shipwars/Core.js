import io from 'socket.io-client'
import UserInterface from './UserInterface'

export default class Core {

    constructor() {

            // Set class fields and methods
            this.socket = io()
            this.ui = new UserInterface
            this.ships = {}
            this.shipsCreated = []

            // Init game
            this.init()

    }

    init() {

        let gamebox = document.createElement('div')
        gamebox.id = 'sea'
        document.body.appendChild(gamebox)

        this.socket.on('frame', (data) => {

            let ships = data.ships

            for (let id in ships) {

                if (this.shipsCreated.indexOf(id) < 0) {

                    let ship = this.ships[id] = {}
                    ship.node = document.createElement('div')
                    ship.node.className = 'ship'
                    ship.node.style.left = ships[id].x + 'px'
                    ship.node.style.top = ships[id].y + 'px'
                    gamebox.appendChild(ship.node)

                    this.shipsCreated.push(id)

                }

            }

            // Delete ships of disconnected users
            this.shipsCreated = this.shipsCreated.filter((id) => {

                if (! ships.hasOwnProperty(id)) {

                    gamebox.removeChild(this.ships[id].node)
                    delete this.ships[id]

                    return false
                }

                return true

            })

            console.log(this.shipsCreated, this.ships)
        })

    }
}