const crypto = require('crypto')
const bitcoin = require('wif')
const EC = require('elliptic').ec
const bs58Check = require('bs58check')
const bs58 = require('bs58')
const BN = require('bn.js')
const curve = new EC('secp256k1');

class Bitcoin {
    constructor(privateKeyParam = '') {
        // Decode base58 wallet import format
        const decode = bs58.decode(privateKeyParam).toString('hex')
        // Remove version byte
        this.privateKey = decode.slice(2, -8)
        
        const ecMultiply = curve.g.mul(this.privateKey)
        const x = ecMultiply.getX().toString('hex')
        const y = ecMultiply.getY().toString('hex')
        this.publicKey = '04' + x + y

        let compressionPrefix
        
        const bnPublicKey = new BN(this.publicKey)

        if (bnPublicKey.isEven()) {
            compressionPrefix = '02'
        } else {
            compressionPrefix = '03'
        }

        this.publicKeyCompressed = compressionPrefix + x
        
        const sha256hash = Buffer.from(this.hash('sha256', Buffer.from(this.publicKeyCompressed)))
        const ripemd160hash = Buffer.from(this.hash('ripemd160', sha256hash))
        const shiftHash160 = '00' + ripemd160hash.toString('hex')
        const doubleSHA = this.hash('SHA256', this.hash('SHA256', Buffer.from(shiftHash160)))
        const checksum = doubleSHA.toString('hex').substr(0, 8)
        const rawAddress = '00' + ripemd160hash.toString() + checksum
        this.address = bs58Check.encode(Buffer.from(rawAddress))
    }

    hash(algorithm, data) {
        return crypto.createHash(algorithm).update(data).digest()
    }
}

module.exports = Bitcoin