import io from 'socket.io-client'
import Config from './Config'
import UserInterface from './UserInterface'

/**
 * @module
 */
export default class Core {

    /**
     * Core constructor.
     * @constructor
     */
    constructor() {

            /**
             * Contains UserInterface instance.
             * @type {module:UserInterface}
             */
            this.ui = new UserInterface

            /**
             * Contains ships object, key is a player id (from Socket.io).
             * @type {object}
             */
            this.ships = {}

            /**
             * Contains list of players’ id.
             * @type {string[]}
             */
            this.shipsCreated = []

            // Init game
            this.init()

    }

    /**
     * Core initiator.
     */
    init() {

        document.body.appendChild(this.ui.gamebox)

        // Append start screen, check if user has keyboard
        this.ui.gamebox.appendChild(this.ui.startScreen)

        let listeners = this.ui.keyDown(null, () => {

            this.ui.unset(listeners)

            this.ui.gamebox.removeChild(this.ui.startScreen)

            this.ui.gamebox.appendChild(this.ui.nicknameScreen)
            
        })

        this.ui.keyDown(13, (e) => { this.join('Jack Sparrow').then((data) => { console.log(data) }) })
        
        this.ui.keyDown(37, (e) => { console.log('keyDown : Left') })
        this.ui.keyDown(38, (e) => { console.log('keyDown : Up') })
        this.ui.keyDown(39, (e) => { console.log('keyDown : Right') })
        this.ui.keyDown(40, (e) => { console.log('keyDown : Down') })

        this.ui.keyUp(37, (e) => { console.log('keyUp : Left') })
        this.ui.keyUp(38, (e) => { console.log('keyUp : Up') })
        this.ui.keyUp(39, (e) => { console.log('keyUp : Right') })
        this.ui.keyUp(40, (e) => { console.log('keyUp : Down') })

        

    }

    start() {

        this.socket = io({
            transports: ['websocket']
        })

        this.socket.on('frame', (data) => {

            let ships = data.ships

            for (let id in ships) {

                if (this.shipsCreated.indexOf(id) < 0) {

                    let ship = this.ships[id] = {}
                    ship.node = document.createElement('div')
                    ship.node.className = 'ship'
                    ship.node.style.left = ships[id].x + 'px'
                    ship.node.style.top = ships[id].y + 'px'
                    this.ui.gamebox.appendChild(ship.node)

                    this.shipsCreated.push(id)

                }

            }

            // Delete ships of disconnected users
            this.shipsCreated = this.shipsCreated.filter((id) => {

                if (! ships.hasOwnProperty(id)) {

                    this.ui.gamebox.removeChild(this.ships[id].node)
                    delete this.ships[id]

                    return false
                }

                return true

            })
            
        })

    }


    //=============================================
    // ] : Setters & Getters ::: Class methods : [
    //=============================================

    /**
     * Join the queue.
     * @param {!string} nickname - Player’s nickname.
     * @returns {Promise}
     */
    join(nickname) {

        return new Promise((resolve, reject) => {

            resolve(Config.MAX_PLAYERS)

        })        

    }

    //===================
    // ] : Class methods
    //===================

}