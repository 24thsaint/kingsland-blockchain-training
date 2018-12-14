const crypto = require('crypto')
const EC = require('elliptic').ec

const keys = new EC('secp256k1').keyFromPrivate('ab00c0942e5677ebd74318051165b8df840582fe69ce562f356f6c3aaec495ee')
const publicKey = keys.getPublic('hex')
const privateKey = keys.getPrivate('hex')

console.log('Public Key:', publicKey)
console.log('Private Key:', privateKey)
const x = keys.getPublic().getX().toString('hex')
const y = keys.getPublic().getY().toString('hex')

// ======== Begin Encryption
const message = 'Hello World'
console.log('Message', message)

const encryptionPoint = new EC('secp256k1').keyFromPublic({x, y})
const encryptionKey = encryptionPoint.getPublic().getY().toString('hex')
console.log('Encryption Key', encryptionKey)

const cipher = crypto.createCipher('aes-256-ctr', encryptionKey)
let cipherMsg = cipher.update(message, 'utf8', 'hex')
cipherMsg += cipher.final('hex')
console.log(cipherMsg)

// ======== Begin Decryption
const decryptionPoint = new EC('secp256k1').keyFromPrivate('ab00c0942e5677ebd74318051165b8df840582fe69ce562f356f6c3aaec495ee')
const decryptionKey = decryptionPoint.getPublic().getY().toString('hex')
console.log('Decryption', decryptionKey)

const decipher = crypto.createDecipher('aes-256-ctr', decryptionKey)
let decipherMsg = decipher.update(cipherMsg, 'hex')
decipherMsg += decipher.final('hex')
console.log(decipherMsg)