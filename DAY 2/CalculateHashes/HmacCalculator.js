const crypto = require('crypto')

class HmacCalculator {
    static calculate(algorithmName, key, message) {
        if (crypto.getHashes().includes(algorithmName)) {
            const hmac = crypto.createHmac(algorithmName, key)
            hmac.update(message)
            return hmac.digest('hex')
        }

        throw new Error(`No implementation for ${algorithmName} algorithm`)
    }
}

module.exports = HmacCalculator