/**
 * @module
 */
export default class AudioInterface {

    /** 
     * Audio constructor.
     * @constructor
     */
    constructor() {

        /**
         * If this variable is set to true any sound will not be played.
         * @type {boolean}
         */
        this.muted = false

        this.init()

        this.cache([
            '/sounds/bg-music.mp3',
            '/sounds/cannonball-shot.mp3',
            '/sounds/cannonball-explosion.mp3',
            '/sounds/ship-explosion.mp3'
        ])

    }

    /** 
     * User interface initiator.
     */
    init() {

        let music = this.music = new Audio
        music.type = 'audio/mpeg'
        music.src = '/sounds/bg-music.mp3'
        music.loop = true
        music.muted = false
        music.play()

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

    //=============================================
    // Class methods : [
    //=============================================

    /**
     * Plays audio.
     * @param {!string} src - Source to audio.
     */
    play(src) {

        if (this.muted) return

        let audio = new Audio
        audio.type = 'audio/mpeg'
        audio.src = src
        audio.play()

    }

    /**
     * Mutes / unmutes audio.
     */
    toggleMute() {

        this.muted = ! this.muted
        this.music.muted = ! this.music.muted

    }

    //===================
    // ] : Class methods
    //===================

}