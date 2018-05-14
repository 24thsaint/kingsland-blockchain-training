const MCrypt = require('mcrypt').MCrypt
const crypto = require('crypto')
const Scrypter = require('../Scrypt/Scrypter')
const HmacCalculator = require('../CalculateHashes/HmacCalculator')

class Encrypter {
    static encrypt(message, password) {
        const salt = crypto.randomBytes(32).toString('hex')
        const scrypt = Scrypter.calculateScrypt(16384, 16, 1, 512, salt, password)
        const encryptionKey = scrypt.substring(0, 256)
        const HMAC = scrypt.substring(256)

        const twoFishEncrypt = new MCrypt('twofish', 'cbc')
        twoFishEncrypt.validateKeySize(false)
        twoFishEncrypt.validateIvSize(false)

        const twoFish = twoFishEncrypt.open(password, salt)
        const encryptedMessage = twoFishEncrypt.encrypt(message)

        const hmacSha256 = HmacCalculator.calculate('sha256', HMAC, message)

        console.log(encryptedMessage)
        const returnObject = {
            scrypt: {
                dklen: 64,
                salt,
                n: 16384,
                r: 16,
                p: 1
            },
            twofish: encryptedMessage.toString('hex'),
            mac: hmacSha256
        }

        return returnObject
    }

    static decrypt(encryptedMessage, password, message) {
        const scrypt = Scrypter.calculateScrypt(16384, 16, 1, 512, encryptedMessage.scrypt.salt, password)
        const encryptionKey = scrypt.substring(0, 256)
        const HMAC = scrypt.substring(256)

        const hmacSha256 = HmacCalculator.calculate('sha256', HMAC, message)

        if (encryptedMessage.mac === hmacSha256) {
            const twoFishEncrypt = new MCrypt('twofish', 'cbc')
            twoFishEncrypt.validateKeySize(false)
            twoFishEncrypt.validateIvSize(false)

            const twoFish = twoFishEncrypt.open(password, encryptedMessage.scrypt.salt)
            const msg = new Buffer(encryptedMessage.twofish, 'hex')
            const decryptedMessage = twoFishEncrypt.decrypt(msg)

            return decryptedMessage.toString()
        }

        return 'INVALID PASSWORD'
    }
}

module.exports = Encrypter