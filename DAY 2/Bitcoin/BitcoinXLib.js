const crypto = require('crypto')
const bitcoin = require('bitcoinjs-lib')
const wif = require('wif')

class Bitcoin {
    constructor(privateKey) {
        let keyPair

        if (privateKey) {
            keyPair = bitcoin.ECPair.fromWIF(privateKey)
        } else {
            keyPair = bitcoin.ECPair.makeRandom({ compressed: false })
        }

        this.privateKey = keyPair.toWIF()
        this.publicKey = keyPair.publicKey.toString('hex')
        this.address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address
    }
}

module.exports = Bitcoin