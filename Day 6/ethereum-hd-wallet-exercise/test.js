const Wallet = require('./EtherWallet')

function restoreWalletNode() {
    const mnemonic = "upset fuel enhance depart portion hope core animal innocent will athlete snack"
    const wallet = Wallet.restoreHDNode(mnemonic)
    console.log('RESTORE WALLET NODE ====================')
    console.log(wallet)
}
restoreWalletNode()

function restoreWallet() {
    const mnemonic = "upset fuel enhance depart portion hope core animal innocent will athlete snack"
    const wallet = Wallet.restoreHDWallet(mnemonic)
    console.log('RESTORE WALLET ===========================')
    console.log(wallet)
}
restoreWallet()

function createWalletHDNode() {
    const walletNode = Wallet.generateRandomHDNode()
    console.log('CREATE WALLET HD NODE ====================')
    console.log(walletNode)
}
createWalletHDNode()

function createRandomWallet() {
    const randomWallet = Wallet.generateRandomHDWallet()
    console.log('CREATE RANDOM WALLET =====================')
    console.log(randomWallet)
}
createRandomWallet()

async function saveWalletAsJSON() {
    const wallet = new Wallet()
    const jsonWallet = await wallet.saveWalletAsJSON('p@$$w0rd~3')
    console.log('SAVE WALLET AS JSON ========================')
    console.log(jsonWallet)
}
saveWalletAsJSON()

async function decryptWallet() {
    const wallet = new Wallet()
    const encryptedWalletJSON = await wallet.saveWalletAsJSON('p@$$w0rd~3')

    const wallet2 = await Wallet.decryptWallet(encryptedWalletJSON, 'p@$$w0rd~3')
    console.log('DECRYPTED WALLET ===========================')
    console.log(wallet2)
    console.log(JSON.stringify(wallet) === JSON.stringify(wallet2) ? "SUCCESS: DECRYPTED WALLET MATCHES ENCRYPTED WALLET" : "ERROR: WALLET MISMATCH")
}
decryptWallet()

function deriveFiveWalletsFromHDNode() {
    const mnemonic = "upset fuel enhance depart portion hope core animal innocent will athlete snack"
    const derivationPath = "m/44'/60'/0'/0/"
    const wallets = Wallet.deriveFiveWalletsFromHDNode(mnemonic, derivationPath)
    console.log('FIVE WALLET DERIVATION =====================')
    console.log(wallets)
    return wallets
}
deriveFiveWalletsFromHDNode()

function signTransactionOnSecondWallet() {
    const wallets = deriveFiveWalletsFromHDNode()
    const wallet = wallets[1] // second wallet
    const recipient = '0x933b946c4fec43372c5580096408d25b3c7936c5'
    const value = '1'
    const signedTransaction = wallet.sign(recipient, value)
    console.log('Signed Transaction ==========================')
    console.log(signedTransaction)
}
signTransactionOnSecondWallet()