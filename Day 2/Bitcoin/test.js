const Bitcoin = require('./Bitcoin')
const btc = Bitcoin.create()
console.log('PRIVATE KEY:', btc.privateKey)
console.log('PUBLIC KEY:', btc.publicKey)

console.log('PRIVATE TO ADDRESS:', Bitcoin.privateToAddress('5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'))