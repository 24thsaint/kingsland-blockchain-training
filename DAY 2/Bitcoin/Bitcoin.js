const crypto = require('crypto')
const bitcoin = require('bitcoinjs-lib')
const wif = require('wif')

class Bitcoin {
    static create() {
        const keyPair = bitcoin.ECPair.makeRandom()
        const privateKey = keyPair.toWIF()
        const publicKey = keyPair.getAddress()

        return {
            privateKey,
            publicKey
        }
    }

    static privateToAddress(privateKey) {
        return privateKey
    }
}

module.exports = Bitcoin