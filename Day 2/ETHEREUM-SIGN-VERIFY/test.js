const Ethereum = require('./Ethereum')

const privateKey = '97ddae0f3a25b92268175400149d65d6887b9cefaf28ea2c078e05cdc15a3c0a'
const message = 'exercise-cryptography'
const signedMessage = Ethereum.sign(privateKey, message)
console.log(signedMessage)
console.log(Ethereum.verify(signedMessage))