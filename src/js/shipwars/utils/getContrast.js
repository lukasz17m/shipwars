/**
 * Calculates contrast color (YIQ).
 * @param {!string} color - Hex value.
 * @returns {string} Black or white hex value.
 */
function getContrast(color) {

    let r = parseInt(color.substr(1, 2), 16),
        g = parseInt(color.substr(3, 2), 16),
        b = parseInt(color.substr(5, 2), 16),
        yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000

    return (yiq >= 128) ? '#000' : '#fff';

}

export default getContrast