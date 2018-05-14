const Encrypter = require('./Encrypter')

const encryptedMsg = Encrypter.encrypt('exercise-cryptography', 'p@$$w0rd~3')
console.log(encryptedMsg)

const decryptedMsg = Encrypter.decrypt(encryptedMsg, 'p@$$w0rd~3', 'exercise-cryptography')
console.log(decryptedMsg)