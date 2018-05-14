const scrypt = require('scrypt')
const crypto = require('crypto')
const utf8 = require('utf8')

class Scrypter {

    // n = iterations, r = blocksize, p = parallelFactor
    static calculateScrypt(n, r, p, derivedKeyLength, salt, rawPassword) {
        const password = utf8.encode(rawPassword)
        const result = scrypt.hashSync(
            password, { N: n, r: r, p: p }, derivedKeyLength, salt
        )
        return result.toString('hex')
    }

    static getRandomSalt(bytes) {
        return crypto.randomBytes(bytes).toString('hex')
    }

}

module.exports = Scrypter