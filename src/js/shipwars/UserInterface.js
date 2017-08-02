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
            count: 0 // Doesn’t show number of listeners!
        }

        this.init()

    }

    /** 
     * User interface initiator.
     */
    init() {

        this.gamebox = document.createElement('div')

        this.startScreen = document.createElement('div')

        this.loginScreen = document.createElement('div')

        this.asidePanel = document.createElement('aside')

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

        let wrapper = document.createElement('div')
        wrapper.className = 'wrapper'
        this.asidePanel.appendChild(wrapper)

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

    get asidePanel() {
        
        return this._asidePanel

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
     * @param {!(number|numbers[])} id - Id or an array of ids of the listeners you want to remove.
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
     * @param {?boolean} spin - If set to false loader disappears.
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

    //===================
    // ] : Class methods
    //===================

}