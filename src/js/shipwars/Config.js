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
    static get MIN_SPEED() {

        return 0

    }

    /**
     * @type {number}
     */
    static get MAX_SPEED() {

        return 5

    }

    /**
     * @type {number}
     */
    static get MIN_HP() {

        return 0

    }

    /**
     * @type {number}
     */
    static get MAX_HP() {

        return 100

    }

    /**
     * @type {number}
     */
    static get MIN_FP() {

        return 0

    }

    /**
     * @type {number}
     */
    static get MAX_FP() {

        return 100

    }

    //=======================
    // ] : Static getters
    //=======================

}