import Config from './Config'

/**
 * @module
 */
export default class Audio {

    /** 
     * Audio constructor.
     * @constructor
     */
    constructor() {

        this.init()

        this.cache([
            '/sounds/cannonball-explosion.mp4',
            '/sounds/ship-explosion.mp4'
        ])

    }

    /** 
     * User interface initiator.
     */
    init() {

        // 

    }

    /** 
     * Caches sounds.
     * @param {!string[]} sounds - Contains array of urls to cache.
     */
    cache(sounds) {

        sounds.forEach(src => {

            let audio = new Audio
            audio.type = 'audio/mpeg'
            audio.src = src

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

        // Speedometer
        let panelSpeed = document.createElement('div')
        panelSpeed.className = 'speed progress'

        let panelSpeedOuter = document.createElement('div')
        panelSpeedOuter.className = 'outer'

        let panelSpeedInner = this._panelSpeedInner = document.createElement('div')
        panelSpeedInner.className = 'inner'

        panelSpeedOuter.appendChild(panelSpeedInner)
        panelSpeed.appendChild(panelSpeedOuter)
        this.asidePanel.appendChild(panelSpeed)

        // Compass
        let panelCompass = document.createElement('div')
        panelCompass.className = 'compass'
        
        const xhr = new XMLHttpRequest()
        xhr.open('GET', '../images/compass.svg')
        xhr.send(null)

        xhr.onload = () => {
            this.compassNeedle = xhr.responseXML.documentElement.getElementById('needle')
            panelCompass.appendChild(xhr.responseXML.documentElement)

        }

        this.asidePanel.appendChild(panelCompass)

        // Hit points
        let panelHP = document.createElement('div')
        panelHP.className = 'hp progress'
        
        let panelHPOuter = document.createElement('div')
        panelHPOuter.className = 'outer'
        
        let panelHPInner = this._panelHPInner = document.createElement('div')
        panelHPInner.className = 'inner'

        panelHPOuter.appendChild(panelHPInner)
        panelHP.appendChild(panelHPOuter)
        this.asidePanel.appendChild(panelHP)

        // Firepower
        let panelFirepower = document.createElement('div')
        panelFirepower.className = 'fp progress'
        
        let panelFirepowerOuter = document.createElement('div')
        panelFirepowerOuter.className = 'outer'
        
        let panelFirepowerInner = this._panelFirepowerInner = document.createElement('div')
        panelFirepowerInner.className = 'inner'

        panelFirepowerOuter.appendChild(panelFirepowerInner)
        panelFirepower.appendChild(panelFirepowerOuter)
        this.asidePanel.appendChild(panelFirepower)

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

            let name = document.createElement('div')
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
     * Makes explosion effect.
     * @param {!object} coords - Explosion coordinates.
     * @param {number=} diameter - Determines explosion power.
     * @param {boolean=} ship - Set to true if you want to get huge explosion.
     */
    explosion(coords, diameter = 100, ship = false) {

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

    //===================
    // ] : Class methods
    //===================

}