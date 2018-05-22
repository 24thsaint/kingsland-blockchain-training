const Wallet = require('./EtherWallet')

const privateKey = '0x495d5c34c912291807c25d5e8300d20b749f6be44a178d5c50f167d495f3315a'

function createWallets() {
    const wallet = Wallet.createWalletFromPrivateKey(privateKey)
    console.log('WALLET ====================')
    console.log(wallet)
    console.log('RANDOM WALLET =========================')
    console.log(Wallet.createRandomWallet())
}
createWallets()

async function saveWallet() {
    const wallet = new Wallet(privateKey)
    const jsonWallet = await wallet.saveWalletToJSON('p@$$w0rd~3')
    console.log('SAVE WALLET ====================')
    console.log(jsonWallet)
}
saveWallet()

async function decryptWallet() {
    const wallet = new Wallet(privateKey)
    const jsonWallet = await wallet.saveWalletToJSON('p@$$w0rd~3')
    const decryptedWallet = await Wallet.getWalletFromEncryptedJSON(jsonWallet, 'p@$$w0rd~3')
    console.log('DECRYPT WALLET ====================')
    console.log(decryptedWallet)
}
decryptWallet()

function signTransaction() {
    const wallet = new Wallet(privateKey)
    const etherValue = "1"
    const signedTranasction = wallet.signTransaction('0x7725f560672A512e0d6aDFE7a761F0DbD8336aA7', etherValue)
    console.log('SIGNED TRANSACTION ================')
    console.log(signedTranasction)
}
signTransaction()