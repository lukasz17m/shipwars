/**
 * @module
 */
module.exports = class Config {

    //=======================
    // Static getters : [
    //=======================

    /**
     * @type {number}
     */
    static get NAME_MIN_CHARS() {

        return 2

    }

    /**
     * @type {number}
     */
    static get NAME_MAX_CHARS() {

        return 16

    }

    /**
     * @type {number}
     */
    static get MAX_PLAYERS() {

        return 4

    }

    /**
     * @type {number}
     */
    static get QUEUE_TIMELIMIT() {

        return 10

    }

    //=======================
    // ] : Static getters
    //=======================

}