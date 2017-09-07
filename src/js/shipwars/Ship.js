/**
 * @module
 */
export default class Ship {

    /** 
     * Ship constructor.
     * @constructor
     */
    constructor(width, color = '#f00') {

        /**
         * Contains ship width in px.
         * @type {number}
         */
        this.width = width

        /**
         * Contains ship color in HTML notation.
         * @type {string}
         */
        this.color = color

        /**
         * Contains sail color in HTML notation.
         * @type {string}
         */
        this.sailcolor = '#efefff'

        this.init()

    }

    /** 
     * Ship initiator.
     */
    init() {

        const canvas = this.canvas = document.createElement('canvas')
        canvas.width = this.width * 4
        canvas.height = this.width * 4
        canvas.className = 'ship'

        const ctx = this.ctx = canvas.getContext('2d')

        // Rear
        ctx.beginPath()
        ctx.arc(this.width / 2, this.width * 2, this.width / 2, 0, 2 * Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()
        
        // Center
        ctx.fillStyle = this.color
        ctx.fillRect(this.width / 2, this.width * 3 / 2, this.width * 3, this.width)

        // Front
        ctx.beginPath();
        ctx.arc(this.width * 7 / 2, this.width * 2, this.width / 2, 0, 2 * Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()

        // Foremast
        ctx.beginPath()
        ctx.arc(this.width * 7 / 3, this.width * 2, this.width * 7 / 6, - Math.PI * 1 / 3, Math.PI * 1 / 3)
        ctx.fillStyle = this.sailcolor
        ctx.fill()

        // Main mast
        ctx.beginPath()
        ctx.arc(this.width * 10 / 9, this.width * 2, this.width * 10 / 7, - Math.PI * 1 / 3, Math.PI * 1 / 3)
        ctx.fillStyle = this.sailcolor
        ctx.fill()

        // Mizenmast
        ctx.beginPath()
        ctx.arc(this.width / 2, this.width * 2, this.width * 8 / 9, - Math.PI * 1 / 3, Math.PI * 1 / 3)
        ctx.fillStyle = this.sailcolor
        ctx.fill()

    }

    //=============================================
    // Setters & Getters : [
    //=============================================

    /**
     * @type {Node}
     */
    set canvas(node) {
        
        this._canvas = node

    }

    get canvas() {
        
        return this._canvas

    }

    //===================
    // ] : Setters & Getters
    //===================

}