/**
 * @module UserInterface
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

        this.nicknameScreen = document.createElement('div')

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
    set nicknameScreen(node) {
        
        this._nicknameScreen = node
        this.nicknameScreen.className = 'nickname-screen'

        let wrapper = document.createElement('div')
        wrapper.className = 'wrapper'
        this.nicknameScreen.appendChild(wrapper)

        let header = document.createElement('h2')
        header.innerText = 'Enter your name, pirate!'
        wrapper.appendChild(header)

        let input = this.nameInput = document.createElement('input')
        input.placeholder = 'Type here'
        input.autofocus = 'autofocus'
        wrapper.appendChild(input)

        let button = document.createElement('div')
        button.className = 'play-button'
        wrapper.appendChild(button)

    }

    get nicknameScreen() {
        
        return this._nicknameScreen

    }

    /**
     * @type {string}
     */
    get nickname() {
        
        return this.nameInput.value

    }

    //=============================================
    // ] : Setters & Getters ::: Class methods : [
    //=============================================

    /**
     * Adds listener for key down,
     * won’t trigger more than once if key is being held down.
     * @param {?number} - keyCode Set to null if you want to listen for any key.
     * @param {!keyboardEventCallback} callback - Function to execute.
     * @returns {array} Returns array of added listeners’ id.
     */
    keyDown(keyCode, callback) {

        let code, fired

        // Adds event listener
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
     * Adds listener for key up.
     * @param {?number} keyCode - Set to null if you want to listen for any key.
     * @param {!keyboardEventCallback} callback - Function to execute.
     * @returns {number} Returns added listener’s id.
     */
    keyUp(keyCode, callback) {

        // Adds event listener
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
     * @param {!(number|numbers[])} id - Id or array of ids of listeners you want to remove.
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

    //===================
    // ] : Class methods
    //===================

}