const EC = require('elliptic').ec;
const ethJsUtils = require('ethereumjs-util')
const HashCalculator = require('./HashCalculator')
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

        const formattedSignedMsg = {
            signature: '0x' + r + s + '0' + v,
            v: '0x' + v,
            r: '0x' + r,
            s: '0x' + s
        }

        const address = Ethereum.getAddress(message, formattedSignedMsg)

        return JSON.stringify({
            address: '0x' + address,
            msg: message,
            sig: formattedSignedMsg.signature,
            version: '1'
        })
    }

    static verify(signedMessageObjectRaw) {
        const signedMessageObject = JSON.parse(signedMessageObjectRaw)

        const signature = signedMessageObject.sig
        const r = signature.substring(2, 64 + 2)
        const s = signature.substring(64 + 2, 64 + 2 + 64)
        const recoveryParam = parseInt(signature.substr(signature.length - 1))

        const signatureObject = {
            r,
            s
        }

        const message = signedMessageObject.msg
        const messageHash = HashCalculator.calculate('keccak256', message)
        const messageHashDecimal = ec.keyFromPrivate(messageHash, 'hex').getPrivate().toString(10)

        const addressParam = signedMessageObject.address
        const recoveredPublicKey = ec.recoverPubKey(messageHashDecimal, signatureObject, recoveryParam, 'hex').encodeCompressed('hex')
        const address = '0x' + ethJsUtils.pubToAddress('0x' + recoveredPublicKey, true).toString('hex')

        const verificationResponse = (address === addressParam) ? 'VALID' : 'INVALID'
        return verificationResponse
    }

    static getAddress(message, signedMessage) {
        const r = signedMessage.r.substring(2)
        const s = signedMessage.s.substring(2)
        const messageHash = HashCalculator.calculate('keccak256', message)
        const messageHashDecimal = ec.keyFromPrivate(messageHash, 'hex').getPrivate().toString(10)
        const recoveryParam = parseInt(signedMessage.v, 16)

        const signedMessageFix = {
            r,
            s
        }

        const recoveredPublicKey = ec.recoverPubKey(messageHashDecimal, signedMessageFix, recoveryParam, 'hex').encodeCompressed('hex')
        const address = ethJsUtils.pubToAddress('0x' + recoveredPublicKey, true).toString('hex')
        return address
    }
}

module.exports = Ethereum