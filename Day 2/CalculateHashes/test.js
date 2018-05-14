const HashCalculator = require('./HashCalculator')
const HmacCalculator = require('./HmacCalculator')

const message = 'blockchain'

console.log('Message       ===', message)
console.log('SHA-384       ===', HashCalculator.calculate('sha384', message))
console.log('SHA-512       ===', HashCalculator.calculate('sha512', message))
console.log('SHA3-512      ===', HashCalculator.calculate('sha3_512', message))
console.log('KECCAK-512    ===', HashCalculator.calculate('keccak512', message))
console.log('WHIRLPOOL-512 ===', HashCalculator.calculate('whirlpool', message))
console.log('HMAC-SHA-512  ===', HmacCalculator.calculate('sha512', 'devcamp', message))