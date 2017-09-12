import Config from './Config'
import getContrast from './utils/getContrast'

/**
 * @module
 */
export default class UserInterface {

    /** 
     * User interface constructor.
     * @constructor
     */
    constructor() {

        /**
         * Object containing custom objects with listener type and function,
         * helpful when you want to unset a listener.<br>Also has a 'count' 
         * member which works like auto increment field in database.
         * @type {object}
         */
        this.listeners = {
            count: 0 // Doesn’t represent number of listeners!
        }

        /**
         * Array containing messages for infobox.
         * @type {string[]}
         */
        this.messages = []

        /**
         * Array containing divs with names in the ranking box.
         * @type {Node[]}
         */
        this.names = []

        this.init()

        this.cache([
            '/images/cannonball-explosion.gif',
            '/images/ship-explosion.gif'
        ])

    }

    /** 
     * User interface initiator.
     */
    init() {

        this.gamebox = document.createElement('div')

        this.startScreen = document.createElement('div')

        this.loginScreen = document.createElement('div')

        this.asidePanel = document.createElement('aside')

        this.helpScreen = document.createElement('div')

        this.infobox = document.createElement('div')

        this.soundButton = document.createElement('div')

    }

    /** 
     * Caches images.
     * @param {!string[]} images - Contains array of urls to cache.
     */
    cache(images) {

        images.forEach(src => {

            let image = new Image
            image.alt = 'cache'
            image.src = src

        })
        
    }

    //=======================
    // Setters & Getters : [
    //=======================

    /**
     * @type {Node}
     */
    set gamebox(node) {
        
        this._gamebox = node
        this.gamebox.id = 'sea'

    }

    get gamebox() {
        
        return this._gamebox

    }

    /**
     * @type {Node}
     */
    set startScreen(node) {
        
        this._startScreen = node
        this.startScreen.className = 'start-screen'

    }

    get startScreen() {
        
        return this._startScreen

    }

    /**
     * @type {Node}
     */
    set loginScreen(node) {
        
        this._loginScreen = node
        this.loginScreen.className = 'nickname-screen'

        let wrapper = document.createElement('div')
        wrapper.className = 'wrapper'
        this.loginScreen.appendChild(wrapper)

        let header = document.createElement('h2')
        header.innerText = 'Enter your name, pirate!'
        wrapper.appendChild(header)

        let input = this._nameInput = document.createElement('input')
        input.autofocus = 'autofocus'
        wrapper.appendChild(input)

        let message = this._errorMessage = document.createElement('div')
        message.className = 'error-message'
        wrapper.appendChild(message)

        let button = this._playButton = document.createElement('div')
        button.className = 'play-button'
        wrapper.appendChild(button)

    }

    get loginScreen() {
        
        return this._loginScreen

    }

    /**
     * @type {Node}
     */
    get playButton() {
        
        return this._playButton

    }

    /**
     * @type {string}
     */
    get nickname() {
        
        return this._nameInput.value.trim()

    }

    /**
     * @type {Node}
     */
    set asidePanel(node) {
        
        this._asidePanel = node
        this.asidePanel.className = 'aside-panel'

        // Info
        let panelInfo = this._panelInfo = document.createElement('div')
        panelInfo.className = 'info'
        this.asidePanel.appendChild(panelInfo)

        // Ranking
        let panelRanking = this._panelRanking = document.createElement('div')
        panelRanking.className = 'ranking scrollable'
        this.asidePanel.appendChild(panelRanking)

        // Spectators
        let panelSpectators = this._panelSpectators = document.createElement('div')
        panelSpectators.className = 'spectators scrollable'
        this.asidePanel.appendChild(panelSpectators)

        // Join / Leave Button
        let panelJoinLeaveBtn = document.createElement('div')
        panelJoinLeaveBtn.className = 'btn'

        let joinLeaveButton = this._joinLeaveButton = document.createElement('div')
        joinLeaveButton.innerText = 'Join'

        panelJoinLeaveBtn.appendChild(joinLeaveButton)
        this.asidePanel.appendChild(panelJoinLeaveBtn)

        // Help button
        let panelHelpBtn = document.createElement('div')
        panelHelpBtn.className = 'btn'

        let helpButton = this._helpButton = document.createElement('div')
        helpButton.innerText = 'Help'
        
        panelHelpBtn.appendChild(helpButton)
        this.asidePanel.appendChild(panelHelpBtn)

        // Indicating devices
        let devices = this._devices = document.createElement('div')
        devices.className = 'devices inactive'

        // Speedometer
        let panelSpeed = document.createElement('div')
        panelSpeed.className = 'speed progress'
        panelSpeed.title = 'Speed'

        let panelSpeedOuter = document.createElement('div')
        panelSpeedOuter.className = 'outer'

        let panelSpeedInner = this._panelSpeedInner = document.createElement('div')
        panelSpeedInner.className = 'inner'

        panelSpeedOuter.appendChild(panelSpeedInner)
        panelSpeed.appendChild(panelSpeedOuter)
        devices.appendChild(panelSpeed)

        // Compass
        let panelCompass = document.createElement('div')
        panelCompass.className = 'compass'
        panelCompass.title = 'Direction'
        
        const xhr = new XMLHttpRequest()
        xhr.open('GET', '../images/compass.svg')
        xhr.send(null)

        xhr.onload = () => {

            this.compassNeedle = xhr.responseXML.documentElement.getElementById('needle')
            panelCompass.appendChild(xhr.responseXML.documentElement)


        }

        devices.appendChild(panelCompass)

        // Hit points
        let panelHP = document.createElement('div')
        panelHP.className = 'hp progress'
        panelHP.title = 'Hit points'
        
        let panelHPOuter = document.createElement('div')
        panelHPOuter.className = 'outer'
        
        let panelHPInner = this._panelHPInner = document.createElement('div')
        panelHPInner.className = 'inner'

        panelHPOuter.appendChild(panelHPInner)
        panelHP.appendChild(panelHPOuter)
        devices.appendChild(panelHP)

        // Firepower
        let panelFirepower = document.createElement('div')
        panelFirepower.className = 'fp progress'
        panelFirepower.title = 'Firepower'
        
        let panelFirepowerOuter = document.createElement('div')
        panelFirepowerOuter.className = 'outer'
        
        let panelFirepowerInner = this._panelFirepowerInner = document.createElement('div')
        panelFirepowerInner.className = 'inner'

        panelFirepowerOuter.appendChild(panelFirepowerInner)
        panelFirepower.appendChild(panelFirepowerOuter)
        devices.appendChild(panelFirepower)

        // Append all devices
        this.asidePanel.appendChild(devices)

    }

    get asidePanel() {

        return this._asidePanel

    }

    /**
     * @type {string}
     */
    set message(message) {

        if (this.messages.length < 2) {

            this.messages.push(message)

        } else {

            this.messages.shift()
            this.messages.push(message)

        }

        let list = document.createElement('ul')

        this.messages.forEach((message, index) => {

            let item = document.createElement('li')

            if (this.messages.length == 2 && index == 0) {
            
                item.className = 'fade'

            }

            item.title = item.innerText = message

            list.appendChild(item)

        })

        this._panelInfo.innerHTML = ''
        this._panelInfo.appendChild(list)

    }

    /**
     * @type {array}
     */
    set ranking(ranking) {

        let list = document.createElement('ul')

        ranking.forEach((player) => {

            let item = document.createElement('li')

            item.style.color = getContrast(player.color)
            item.style.backgroundColor = player.color

            let name = this.names[player.name] = document.createElement('div')
            name.className = 'name'
            name.title = name.innerText = player.name

            let score = document.createElement('div')
            score.className = 'score'
            score.innerText = player.score

            item.appendChild(name)
            item.appendChild(score)
            
            list.appendChild(item)

        })

        this._panelRanking.innerHTML = ''
        this._panelRanking.appendChild(list)

    }

    /**
     * @type {object}
     */
    set rankingHp(rankingHp) {

        for (let name in rankingHp) {

            this.names[name].style.background =
                `linear-gradient(90deg, rgba(0, 0, 0, 0.2) ${ rankingHp[name] }%, transparent ${ rankingHp[name] }%)`

        }

    }

    /**
     * @type {array}
     */
    set spectators(spectators) {

        let list = document.createElement('ul')

        spectators.forEach((spectator, index) => {

            let item = document.createElement('li')

            if (index % 2 == 0) {
            
                item.className = 'fade'

            }

            item.title = item.innerText = spectator

            list.appendChild(item)

        })

        this._panelSpectators.innerHTML = ''
        this._panelSpectators.appendChild(list)

    }

    /**
     * @type {number}
     */
    set speed(speed) {

        this._panelSpeedInner.style.width = Math.round(speed / Config.MAX_SPEED * 100) + '%'

    }

    /**
     * @type {number}
     */
    set direction(direction) {

        this.compassNeedle.style.transform = `rotate(${ -direction + 90 }deg)`

    }

    /**
     * @type {number}
     */
    set hp(hp) {

        this._panelHPInner.style.width = Math.round(hp / Config.MAX_HP * 100) + '%'

    }

    /**
     * @type {number}
     */
    set fp(fp) {

        this._panelFirepowerInner.style.width = Math.round(fp / Config.MAX_FP * 100) + '%'

    }

    /**
     * @type {Node}
     */
    get joinLeaveButton() {

        return this._joinLeaveButton

    }

    /**
     * @type {Node}
     */
    get helpButton() {

        return this._helpButton

    }

    /**
     * @type {Node}
     */
    set helpScreen(node) {
        
        this._helpScreen = node
        this.helpScreen.className = 'help-screen'

        this.helpScreen.innerHTML = 
        `
        <strong>Arrows</strong><br>\n
        <strong class="indent">Up</strong> - Accelerate<br>\n
        <strong class="indent">Down</strong> - Decelerate<br>\n
        <strong class="indent">Left</strong> - Turn left<br>\n
        <strong class="indent">Right</strong> - Turn right<br>\n
        <br>\n
        <strong>A</strong> - Shoot left<br>\n
        <strong>D</strong> - Shoot right<br>\n
        <br>\n
        <strong>R</strong> - Repair<br>\n
        <br>\n
        <strong>M</strong> - Toggle music<br>\n
        <strong>H</strong> - Toggle this window
        `

        this.helpScreen.onclick = this.toggleHelp.bind(this)


    }

    get helpScreen() {

        return this._helpScreen

    }

    /**
     * @type {Node}
     */
    set infobox(node) {
        
        this._infobox = node
        this.infobox.id = 'infobox'

    }

    get infobox() {
        
        return this._infobox

    }

    /**
     * @type {number}
     */
    set ping(ping) {

        this._infobox.innerText = `Ping: ${ ping }ms`

    }

    /**
     * @type {Node}
     */
    set soundButton(node) {
        
        this._soundButton = node
        this.soundButton.id = 'sound-button'

    }

    get soundButton() {
        
        return this._soundButton

    }

    //=============================================
    // ] : Setters & Getters ::: Class methods : [
    //=============================================

    /**
     * Adds a listener for key down,
     * won’t trigger more than once if the key is being held down.
     * @param {?number} - keyCode Set to null if you want to listen for any key.
     * @param {!keyboardEventCallback} callback - Function to execute.
     * @returns {array} Returns an array of added listeners’ id.
     */
    keyDown(keyCode, callback) {

        let code, fired

        let down = ++this.listeners.count

        this.listeners[down] = {

            type: 'keydown',

            _function(e) {

                if (fired || (keyCode !== null && e.keyCode !== keyCode)) return

                code = e.keyCode

                fired = true

                callback(e)

            }
        }

        window.addEventListener(this.listeners[down].type, this.listeners[down]._function)

        // Blocks triggering callback until key is released.
        let up = ++this.listeners.count

        this.listeners[up] = {

            type: 'keyup',

            _function(e) {

                if (e.keyCode === code) {

                    fired = false

                }

            }

        }

        window.addEventListener(this.listeners[up].type, this.listeners[up]._function)

        return [down, up]

    }

    /**
     * Adds a listener for key up.
     * @param {?number} keyCode - Set to null if you want to listen for any key.
     * @param {!keyboardEventCallback} callback - Function to execute.
     * @returns {number} Returns added listener’s id.
     */
    keyUp(keyCode, callback) {

        let up = ++this.listeners.count

        this.listeners[up] = {

            type: 'keyup',

            _function(e) {

                if (keyCode !== null && e.keyCode !== keyCode) return

                callback(e)

            }

        }

        window.addEventListener(this.listeners[up].type, this.listeners[up]._function)

        return up

    }

    /**
     * Unsets existing listener.
     * @param {!(number|number[])} id - Id or an array of ids of the listeners you want to remove.
     * @return {boolean} Returns true on success.
     */
    unset(id) {

        if (id.length > 0) {

            for (let i = 0; i < id.length; i++) {

                window.removeEventListener(this.listeners[id[i]].type, this.listeners[id[i]]._function)
                delete this.listeners[id[i]]

            }

        } else {

            window.removeEventListener(this.listeners[id].type, this.listeners[id]._function)
            delete this.listeners[id]

        }

        return true

    }

    /**
     * Changes play button to infinity radial progress.
     * @param {boolean=} spin - If set to false loader disappears.
     */
    spinPlayButton(spin = true) {

        if (spin) {

            this._playButton.classList.add('loading')

        } else {

            this._playButton.classList.remove('loading')

        }

    }

    /**
     * Hides login error message.
     */
    hideErrorMessage() {

        this._errorMessage.classList.remove('visible')
        this._errorMessage.innerText = ''

    }

    /**
     * Shows login error message.
     * @param {!string} message - Text to display.
     */
    showErrorMessage(message) {

        this._errorMessage.classList.add('visible')
        this._errorMessage.innerText = message

    }

    /**
     * Updates join / leave button.
     * @param {!string} message - Text to display.
     */
    updateJoinLeaveButton(state) {

        switch (state) {

            case 0:

                this._joinLeaveButton.classList.add('disabled')
                this._joinLeaveButton.innerText = 'Join'

                break

            case 1:

                this._joinLeaveButton.classList.remove('disabled')
                this._joinLeaveButton.innerText = 'Join'

                break

            case 2:

                this._joinLeaveButton.classList.remove('disabled')
                this._joinLeaveButton.innerText = 'Leave'

                break

            default:

        }

    }

    /**
     * Toggles indicating devices.
     */
    toggleDevices() {

        if (this._devices.classList.contains('inactive')) {
        
            this._devices.classList.remove('inactive')
        
        } else {

            this.speed = Config.MAX_SPEED
            this.direction = -90
            this.hp = Config.MAX_HP
            this.fp = Config.MAX_FP
            this._devices.classList.add('inactive')
            
        }

    }

    /**
     * Toggles help screen.
     */
    toggleHelp() {

        if (this.gamebox.contains(this.helpScreen)) {
        
            this.gamebox.removeChild(this.helpScreen)
        
        } else {

            this.gamebox.appendChild(this.helpScreen)
            
        }

    }

    /**
     * Makes explosion effect.
     * @param {!object} coords - Explosion coordinates.
     * @param {!number} diameter - Determines explosion power.
     * @param {boolean=} ship - Set to true if you want to get huge explosion.
     */
    explosion(coords, diameter, ship = false) {

        const boom = new Image
        boom.alt = ship ? 'Ship explosion' : 'Cannonball explosion'
        boom.src = ship ? '/images/ship-explosion.gif' : '/images/cannonball-explosion.gif'
        boom.className = 'explosion'
        boom.style.width = diameter * 2 + 'px'
        boom.style.left = coords.x + 'px'
        boom.style.top = (ship ? coords.y - 130 : coords.y) + 'px'

        this.gamebox.appendChild(boom)

        let lasting = ship ? 1200 : 500

        setTimeout(() => this.gamebox.removeChild(boom), lasting)

    }

    /**
     * Shows mute button.
     */
    audioControls() {

        this.gamebox.appendChild(this.soundButton)

    }

    /**
     * Toggles sound icon.
     */
    toggleMute() {

        if (this.soundButton.classList.contains('muted')) {
        
            this.soundButton.classList.remove('muted')
        
        } else {

            this.soundButton.classList.add('muted')
            
        }

    }

    //===================
    // ] : Class methods
    //===================

}