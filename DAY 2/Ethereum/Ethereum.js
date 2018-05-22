const EC = require('elliptic').ec;
const ethJsUtils = require('ethereumjs-util')
const HashCalculator = require('../CalculateHashes/HashCalculator')
const secp256k1 = require('secp256k1')
const ec = new EC('secp256k1');

class Ethereum {

    static createKeyPair() {
        return ec.genKeyPair()
    }

    static sign(privateKey, message) {
        const keyPair = ec.keyFromPrivate(privateKey)
        const messageHash = HashCalculator.calculate('keccak256', message)

        const signedMessage = keyPair.sign(messageHash)

        const r = signedMessage.r.toString('hex')
        const s = signedMessage.s.toString('hex')
        const v = signedMessage.recoveryParam.toString()

        return {
            signature: '0x' + r + s + '0' + v,
            v: '0x' + v,
            r: '0x' + r,
            s: '0x' + s
        }
    }

    static verify(message, addressParam, signature) {
        const r = signature.substring(2, 64 + 2)
        const s = signature.substring(64 + 2, 64 + 2 + 64)
        const recoveryParam = parseInt(signature.substr(signature.length - 1))
        const signatureObject = {
            r,
            s
        }

        console.log(signatureObject)

        const messageHash = HashCalculator.calculate('keccak256', message)
        const messageHashDecimal = ec.keyFromPrivate(messageHash, 'hex').getPrivate().toString(10)

        const recoveredPublicKey = ec.recoverPubKey(messageHashDecimal, signatureObject, recoveryParam, 'hex').encodeCompressed('hex')
        const address = ethJsUtils.pubToAddress('0x' + recoveredPublicKey, true).toString('hex')

        const verificationResponse = address === addressParam
        return verificationResponse
    }

    static getAddress(message, signedMessage) {
        const messageHash = HashCalculator.calculate('keccak256', message)
        const messageHashDecimal = ec.keyFromPrivate(messageHash, 'hex').getPrivate().toString(10)
        const recoveryParam = parseInt(signedMessage.v, 16)

        const signedMessageFix = {
            r: signedMessage.r.substring(2),
            s: signedMessage.s.substring(2)
        }

        const recoveredPublicKey = ec.recoverPubKey(messageHashDecimal, signedMessageFix, recoveryParam, 'hex').encodeCompressed('hex')
        const address = ethJsUtils.pubToAddress('0x' + recoveredPublicKey, true).toString('hex')
        return address
    }
}

module.exports = Ethereum