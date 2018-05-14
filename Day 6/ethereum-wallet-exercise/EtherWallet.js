const ethers = require('ethers')

class EtherWallet {
    constructor(privateKey) {
        if (privateKey) {
            this.wallet = EtherWallet.createWalletFromPrivateKey(privateKey)
        } else {
            this.wallet = EtherWallet.createRandomWallet()
        }
    }

    static createWalletFromPrivateKey(privateKey) {
        const wallet = new EtherWallet
        return new ethers.Wallet(privateKey)
    }

    static createRandomWallet() {
        return new ethers.Wallet.createRandom()
    }

    async saveWalletToJSON(password) {
        const encryptedWallet = await this.wallet.encrypt(password)
        return encryptedWallet
    }

    static async getWalletFromEncryptedJSON(json, password) {
        const decryptedWallet = await ethers.Wallet.fromEncryptedWallet(json, password)
        return decryptedWallet
    }

    signTransaction(toAddress, value) {
        let transaction = {
            nonce: 0,
            gasLimit: 21000,
            gasPrice: ethers.utils.bigNumberify(2000000000),
            to: toAddress,
            value: ethers.utils.parseEther(value),
            data: '0x'
        }
        return this.wallet.sign(transaction)
    }
}

module.exports = EtherWallet