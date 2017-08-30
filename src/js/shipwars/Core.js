import io from 'socket.io-client'
import Config from './Config'
import UserInterface from './UserInterface'
import getContrast from './utils/getContrast'

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
             * Contains cannonballs object, key is an unique autoincremented id.
             * @type {object}
             */
            this.cannonballs = {}

            /**
             * Contains list of cannonballs’ id.
             * @type {number[]}
             */
            this.cannonballsCreated = []

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

        document.body.appendChild(this.ui.infobox)

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

    }

    //=============================================
    // ] : Setters & Getters ::: Class methods : [
    //=============================================

    /**
     * Join spectators.
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

        // Ping pong
        function ping() {

            let pingTime = Date.now()

            this.socket.emit('pingpong', () => {

                let pongTime = Date.now()

                this.ui.ping = pongTime - pingTime
            
            })

            setTimeout(ping.bind(this), 1000)

        }

        ping.call(this)

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

        // Spectators
        this.socket.on('spectators', (spectators) => this.ui.spectators = spectators)

        // Frame
        this.socket.on('frame', (data) => {

            // Loop the ships
            let ships = data.ships

            for (let id in ships) {

                if (this.shipsCreated.indexOf(id) < 0) {

                    let ship = document.createElement('div')
                    ship.className = 'ship'
                    ship.style.backgroundColor = ships[id].color
                    ship.style.left = Math.round(ships[id].x) + 'px'
                    ship.style.top = Math.round(ships[id].y) + 'px'
                    this.ui.gamebox.appendChild(ship)

                    this.ships[id] = ship

                    this.shipsCreated.push(id)

                } else {

                    this.ships[id].style.left = Math.round(ships[id].x) + 'px'
                    this.ships[id].style.top = Math.round(ships[id].y) + 'px'
                    this.ships[id].style.transform = `translate(-50%, -50%) rotate(${ -Math.round(ships[id].angle) }deg)`

                }

            }

            // Delete ship of user who left the game
            this.shipsCreated = this.shipsCreated.filter((id) => {

                if (! ships.hasOwnProperty(id)) {

                    this.ui.gamebox.removeChild(this.ships[id])
                    delete this.ships[id]

                    return false
                }

                return true

            })

            // Loop the cannonballs
            let cannonballs = data.cannonballs

            for (let id in cannonballs) {

                if (this.cannonballsCreated.indexOf(id) < 0) {

                    let cannonball = document.createElement('div')
                    cannonball.className = 'cannonball'
                    cannonball.style.fontSize = cannonballs[id].diameter + 'px'
                    cannonball.style.backgroundColor = cannonballs[id].color
                    cannonball.style.left = Math.round(cannonballs[id].x) + 'px'
                    cannonball.style.top = Math.round(cannonballs[id].y) + 'px'
                    cannonball.style.color = getContrast(cannonballs[id].color)
                    cannonball.dataset.power = cannonballs[id].power
                    this.ui.gamebox.appendChild(cannonball)

                    this.cannonballs[id] = cannonball

                    this.cannonballsCreated.push(id)

                } else {

                    this.cannonballs[id].style.left = Math.round(cannonballs[id].x) + 'px'
                    this.cannonballs[id].style.top = Math.round(cannonballs[id].y) + 'px'

                }

            }

            // Delete destroyed cannonballs
            this.cannonballsCreated = this.cannonballsCreated.filter((id) => {

                if (! cannonballs.hasOwnProperty(id)) {

                    this.ui.gamebox.removeChild(this.cannonballs[id])
                    delete this.cannonballs[id]

                    return false
                }

                return true

            })

            // Progress bars
            if (typeof ships[this.socket.id] != 'undefined') {

                const ship = ships[this.socket.id]

                // Update speedometer
                this.ui.speed = ship.speed

                // Update compass
                this.ui.direction = ship.angle

                // Update hitpoints
                this.ui.hp = ship.hp

                // Update firepower meter
                this.ui.fp = ship.fp

            }

            
        })

        // Update button state
        this.socket.on('canjoin', (state) => this.ui.updateJoinLeaveButton(state))

        // Update button state
        this.socket.on('console', (message) => console.log(message))
    }

    /**
     * Inits UI listeners.
     */
    userInterfaceListen() {

        // Join / Leave button
        this.ui.joinLeaveButton.onclick = () => {

            if (this.inGame) {

                this.socket.emit('leave')

                this.inGame = false

            } else {

                this.socket.emit('join', (success) => {

                    if (success) {

                        this.ui.updateJoinLeaveButton(2)

                        this.inGame = true

                    }

                })

            }
            
        }

        // Help button
        this.ui.helpButton.onclick = () => {
            console.log('Help')
        }

        // Steerage

        // Accelerate
        this.ui.keyDown(38, (e) => {

            // keyDown : Up
            this.socket.emit('action', 1)

        })

        this.ui.keyUp(38, (e) => {

            // keyUp : Up
            this.socket.emit('action', 10)

        })

        // Decelerate
        this.ui.keyDown(40, (e) => {

            // keyDown : Down
            this.socket.emit('action', 2)

        })

        this.ui.keyUp(40, (e) => {

            // keyUp : Down
            this.socket.emit('action', 20)

        })

        // Turn left
        this.ui.keyDown(37, (e) => {

            // keyDown : Left
            this.socket.emit('action', 3)

        })

        this.ui.keyUp(37, (e) => {

            // keyUp : Left
            this.socket.emit('action', 30)

        })

        // Turn right
        this.ui.keyDown(39, (e) => {

            // keyDown : Right
            this.socket.emit('action', 4)

        })

        this.ui.keyUp(39, (e) => {

            // keyUp : Right
            this.socket.emit('action', 40)

        })

        // Shoot left
        this.ui.keyDown(65, (e) => {

            // keyDown : A
            this.socket.emit('action', 5)

        })

        this.ui.keyUp(65, (e) => {

            // keyUp : A
            this.socket.emit('action', 50)

        })

        // Shoot right
        this.ui.keyDown(68, (e) => {

            // keyDown : D
            this.socket.emit('action', 6)

        })

        this.ui.keyUp(68, (e) => {

            // keyUp : D
            this.socket.emit('action', 60)

        })

    }

    //===================
    // ] : Class methods
    //===================

}