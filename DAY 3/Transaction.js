const HashCalculator = require('./CalculateHashes/HashCalculator.js')
const Signer = require('./Signer')

class Transaction {
    constructor(from, to, value, fee, dateCreated, data, senderPubKey) {
        this.from = from
        this.to = to
        this.value = value
        this.fee = fee
        this.dateCreated = dateCreated
        this.data = data
        this.senderPubKey = senderPubKey
    }

    calculateTransactionHash() {
        let transactionDataJson = JSON.stringify(this)
        this.transactionHash = HashCalculator.calculate('sha256', transactionDataJson).toString()
        return this.transactionHash
    }

    sign(privateKey) {
        this.senderSignature = Signer.signData(this.transactionHash, privateKey)
        return this.senderSignature
    }

    verify() {
        return Signer.verifySignature(this.transactionHash, this.senderPubKey, this.senderSignature)
    }
}

module.exports = Transaction