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

            /**
             * Indicates if user is currently in game.
             * @type {string[]}
             */
            this.inGame = false

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

        let anyListener = this.ui.keyDown(null, () => {

            // Remove the listener
            this.ui.unset(anyListener)

            // Remove the start screen
            this.ui.gamebox.removeChild(this.ui.startScreen)

            // Show the login box
            this.ui.gamebox.appendChild(this.ui.loginScreen)

            // Listen for the input
            this.ui.playButton.onclick = tryLogin.bind(this)

            // Local function for the listener
            function tryLogin() {

                this.login(this.ui.nickname)
                .then((data) => {

                    this.ui.hideErrorMessage()

                    // Remove the login box
                    this.ui.gamebox.removeChild(this.ui.loginScreen)

                    // Append aside panel
                    this.ui.gamebox.appendChild(this.ui.asidePanel)

                    // Listen for the server emits
                    this.listen()

                    // Listen for the user interface interaction
                    this.userInterfaceListen()

                })
                .catch((error) => this.ui.showErrorMessage(error))

            }
        })

        this.ui.keyDown(37, (e) => console.log('keyDown : Left'))
        this.ui.keyDown(38, (e) => console.log('keyDown : Up'))
        this.ui.keyDown(39, (e) => console.log('keyDown : Right'))
        this.ui.keyDown(40, (e) => console.log('keyDown : Down'))

        this.ui.keyUp(37, (e) => console.log('keyUp : Left'))
        this.ui.keyUp(38, (e) => console.log('keyUp : Up'))
        this.ui.keyUp(39, (e) => console.log('keyUp : Right'))
        this.ui.keyUp(40, (e) => console.log('keyUp : Down'))

    }

    // temp
    start() {

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
    login(nickname) {

        return new Promise((resolve, reject) => {

            if (nickname.length < Config.NAME_MIN_CHARS) {

                reject(`Your nickname is too short (min ${ Config.NAME_MIN_CHARS } char${ Config.NAME_MIN_CHARS > 1 ? 's' : '' })`)

            } else if (nickname.length > Config.NAME_MAX_CHARS) {

                reject(`Your nickname is too long (max ${ Config.NAME_MAX_CHARS } char${ Config.NAME_MAX_CHARS > 1 ? 's' : '' })`)

            } else {

                // Begin async...
                this.ui.spinPlayButton()

                /**
                 * Contains Socket.io instance,
                 * available only after successful login.
                 */
                this.socket = io({
                    transports: ['websocket']
                })

                this.socket.emit('login', nickname, (data) => {

                    // End async
                    this.ui.spinPlayButton(false)

                    if (! data) {
                        reject('This nickname is taken')
                    }

                    resolve()

                })

            }

        })        

    }

    /**
     * Inits Socket.io listeners.
     */
    listen() {

        // Messagebox
        this.socket.on('info', (message) => this.ui.message = message)

        // Ranking
        this.socket.on('ranking', (list) => {

            let ranking = []

            let members = list.filter((foo, index) => {

                if (index % 2 == 0) {

                    return true
                
                }

                return false

            })

            this.socket.emit('getColors', members, (colors) => {
            
                let i = 0

                for (let j = 0; j < list.length; j += 2) {

                    ranking.push({ name: list[j], score: list[j + 1], color: colors[i++] })

                }

                this.ui.ranking = ranking

            })

        })

        // Queue
        this.socket.on('queue', (queue) => this.ui.queue = queue)

        // Frame
        this.socket.on('frame', (data) => {

            let ships = data.ships

            for (let id in ships) {

                if (this.shipsCreated.indexOf(id) < 0) {

                    let ship = this.ships[id] = {}
                    ship.node = document.createElement('div')
                    ship.node.className = 'ship'
                    ship.node.style.backgroundColor = ships[id].color
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

        // temp
        this.socket.on('onlytoid', (data) => console.log(data))
    }

    /**
     * Inits UI listeners.
     */
    userInterfaceListen() {

        // Join / Leave button
        this.ui.joinLeaveButton.onclick = () => {
            console.log('Join / Leave')

            if (this.inGame) {

                this.socket.emit('leave', (response) => {

                    if (response == 2) {

                        this.inGame = false

                        this.ui.updateJoinLeaveButton(response)

                    }

                })

            } else {

                this.socket.emit('join', (response) => {

                    if (response == 1) {

                        this.inGame = true

                        this.ui.updateJoinLeaveButton(response)

                    }

                })

            }
            
        }

        // Help button
        this.ui.helpButton.onclick = () => {
            console.log('Help')
        }

    }

    //===================
    // ] : Class methods
    //===================

}