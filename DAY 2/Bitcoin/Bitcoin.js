const crypto = require('crypto')
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
        
        // Q = dG
        const ecMultiply = curve.g.mul(this.privateKey)
        
        const x = ecMultiply.getX().toString('hex')
        const y = ecMultiply.getY().toString('hex')

        /**
         * A public key is a 65 byte long value consisting 
         * of a leading 0x04 and X and Y coordinates of 
         * 32 bytes each. 
         */
        this.publicKey = '04' + x + y

        let compressionPrefix
        
        const bnPublicKey = new BN(this.publicKey)

        if (bnPublicKey.isEven()) {
            compressionPrefix = '02'
        } else {
            compressionPrefix = '03'
        }

        this.publicKeyCompressed = compressionPrefix + x
        const zeroBuffer = Buffer.from('00')

        const sha256hash = this.hash('sha256', Buffer.from(this.publicKeyCompressed))
        
        /**
         * RIPEMD160 fails.
         * Python and Javascript are outputting different
         * values.
         */
        const ripemd160hash = this.hash('ripemd160', sha256hash)

        console.log(sha256hash.toString('hex'))
        console.log(ripemd160hash.toString('hex'))

        const shiftHash160 = Buffer.concat([zeroBuffer, ripemd160hash])
        const doubleSHA = this.hash('SHA256', this.hash('SHA256', shiftHash160))
        const checksum = doubleSHA.toString('hex').substr(0, 8)
        const rawAddress = Buffer.concat([zeroBuffer, ripemd160hash, Buffer.from(checksum)])
        this.address = bs58Check.encode(Buffer.from(rawAddress))
    }

    hash(algorithm, data) {
        return crypto.createHash(algorithm).update(data).digest()
    }
}

module.exports = Bitcoin