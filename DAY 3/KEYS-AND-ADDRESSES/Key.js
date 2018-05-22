const crypto = require('crypto')
const EC = require('elliptic').ec;
const HashCalculator = require('./HashCalculator')

const ec = new EC('secp256k1');

class Key {
    constructor(key) {
        let keys
        if (key) {
            this.privateKey = key
            keys = ec.keyFromPrivate(this.privateKey)
        } else {
            keys = ec.genKeyPair()
            this.privateKey = keys.getPrivate('hex')
        }

        const xCoord = keys.getPublic().getX().toString('hex')
        const isEvenYCoord = (keys.getPublic().getY().toString(10) % 2) === 0 ? '1' : '0'
        this.publicKey = (xCoord + isEvenYCoord)
        this.address = HashCalculator.calculate('ripemd160', this.publicKey)
    }
}

module.exports = Key