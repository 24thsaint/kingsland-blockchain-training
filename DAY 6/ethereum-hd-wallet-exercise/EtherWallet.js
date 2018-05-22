const ethers = require('ethers')

class EtherWallet {

    constructor(key) {
        if (key) {
            if (key.includes(' ')) {
                this.wallet = EtherWallet.restoreHDWallet(key)
            } else if (key.length === 66) {
                this.wallet = EtherWallet.createWalletFromPrivateKey(key)
            } else {
                throw new Error('Wallet Syntax Error')
            }
        } else {
            this.wallet = EtherWallet.generateRandomHDWallet()
        }
    }

    static createWalletFromPrivateKey(privateKey) {
        const wallet = new EtherWallet
        return new ethers.Wallet(privateKey)
    }

    static restoreHDNode(mnemonic) {
        return ethers.HDNode.fromMnemonic(mnemonic)
    }

    static restoreHDWallet(mnemonic) {
        return ethers.Wallet.fromMnemonic(mnemonic)
    }

    static generateMnemonic() {
        const randomEntropyBytes = ethers.utils.randomBytes(16)
        return ethers.HDNode.entropyToMnemonic(randomEntropyBytes)
    }

    static generateRandomHDNode() {
        const mnemonic = EtherWallet.generateMnemonic()
        return ethers.HDNode.fromMnemonic(mnemonic)
    }

    static generateRandomHDWallet() {
        return ethers.Wallet.createRandom()
    }

    async saveWalletAsJSON(password) {
        return await this.wallet.encrypt(password)
    }

    static async decryptWallet(json, password) {
        const decryptedWallet = await ethers.Wallet.fromEncryptedWallet(json, password)
        return new EtherWallet(decryptedWallet.mnemonic)
    }

    static deriveFiveWalletsFromHDNode(mnemonic, derivationPath) {
        const wallets = []

        for (let index = 0; index < 5; index++) {
            const hdNode = EtherWallet.restoreHDNode(mnemonic).derivePath(derivationPath + index)
            const wallet = new EtherWallet(hdNode.privateKey)
            wallets.push(wallet)
        }

        return wallets
    }

    sign(toAddress, value) {
        const transaction = {
            nonce: 0,
            gasLimit: 21000,
            gasPrice: ethers.utils.bigNumberify('2000000000'),
            to: toAddress,
            value: ethers.utils.parseEther(value),
            data: '0x'
        }
        return this.wallet.sign(transaction)
    }
}

module.exports = EtherWallet