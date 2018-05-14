const Scrypter = require('./Scrypter')

const output1 = Scrypter.calculateScrypt(
    16384,
    16,
    1,
    32,
    '7b07a2977a473e84fc30d463a2333bcfea6cb3400b16bec4e17fe981c925ba4f',
    'p@$$w0rd~3'
)

console.log('Hardcoded salt: ', output1)

const output2 = Scrypter.calculateScrypt(
    16384,
    16,
    1,
    32,
    Scrypter.getRandomSalt(32),
    'p@$$w0rd~3'
)

console.log('Random salt:    ', output2)