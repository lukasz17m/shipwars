/** 
 * @module
 */
export default class UserInterface {

    /** 
     * User interface constructor.
     * @constructor
     */
    constructor() {

        this.listeners = {
            count: 0 // Doesn’t show number of listeners!
        }

        this.init()

    }

    init() {

        this._startScreen = document.createElement('div')
        this._startScreen.className = 'start-screen'

    }

    //=======================
    // Getters & Setters : [
    //=======================

    /**
     * @type {Node}
     */
    get startScreen() {
        
        return this._startScreen

    }

    //=============================================
    // ] : Getters & Setters ::: Class methods : [
    //=============================================

    /**
     * Adds listener for key down,
     * won’t trigger more than once if key is being held down.
     * @param {number} keyCode Set to null if you want to listen for any key.
     * @param {keyboardEventCallback} callback - Function to execute.
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
     * @param {number} keyCode - Set to null if you want to listen for any key.
     * @param {keyboardEventCallback} callback - Function to execute.
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
     * This callback is triggered on specified user action.
     * @callback keyboardEventCallback
     * @param {KeyboardEvent} e - Contains KeyboardEvent instance.
     */

    /**
     * Unsets existing listener.
     * @param {(number|array)} id - Id or array of ids of listeners you want to remove.
     * @return {boolean} Returns true on success.
     */
    unset(id) {

        if (id.length > 0) {

            for (let i = 0; i < id.length; i++) {

                window.removeEventListener(this.listeners[id[i]].type, this.listeners[id[i]]._function)
                delete this.listeners[id[i]]

            }

        } else {

            window.removeEventListener(this.listeners[id[i]].type, this.listeners[id[i]]._function)
            delete this.listeners[id[i]]

        }
        
        console.log(this.listeners)
        return true

    }

    //===================
    // ] : Class methods
    //===================

}