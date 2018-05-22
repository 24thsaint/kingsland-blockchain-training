const CryptoJS = require('crypto-js')
const EC = require('elliptic').ec
const secp256k1 = new EC('secp256k1')

class Signer {
    static signData(data, privateKey) {
        let keyPair = secp256k1.keyFromPrivate(privateKey)
        let signature = keyPair.sign(data)
        return [signature.r.toString(16), signature.s.toString(16)]
    }

    static decompressPublicKey(publicKeyCompressed) {
        let pubKeyX = publicKeyCompressed.substring(0, 64)
        let pubKeyYOdd = parseInt(publicKeyCompressed.substring(64))
        let pubKeyPoint = secp256k1.curve.pointFromX(pubKeyX, pubKeyYOdd)

        return pubKeyPoint
    }

    static verifySignature(data, publicKey, signature) {
        let pubKeyPoint = Signer.decompressPublicKey(publicKey)
        let keyPair = secp256k1.keyPair({ pub: pubKeyPoint })
        let result = keyPair.verify(data, { r: signature[0], s: signature[1] })
        return result
    }
}

module.exports = Signer