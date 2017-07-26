import io from 'socket.io-client'
import UserInterface from './UserInterface'

export default class Core {

    constructor() {

            // Set class fields and methods

            // this.socket = io({
            //     transports: ['websocket']
            // })

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

        // Append start screen, check if user has keyboard
        gamebox.appendChild(this.ui.startScreen)

        let listeners = this.ui.keyDown(null, () => {
            gamebox.removeChild(this.ui.startScreen)
            this.ui.unset(listeners)
        })
        
        console.log(this.ui.listeners)
        console.log(this.ui.keyDown(37, (e) => { console.log('keyDown : Left') }))
        this.ui.keyDown(38, (e) => { console.log('keyDown : Up') })
        this.ui.keyDown(39, (e) => { console.log('keyDown : Right') })
        this.ui.keyDown(40, (e) => { console.log('keyDown : Down') })

        this.ui.keyUp(37, (e) => { console.log('keyUp : Left') })
        this.ui.keyUp(38, (e) => { console.log('keyUp : Up') })
        this.ui.keyUp(39, (e) => { console.log('keyUp : Right') })
        this.ui.keyUp(40, (e) => { console.log('keyUp : Down') })

        /*this.socket.on('frame', (data) => {

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
            
        })*/

    }
}