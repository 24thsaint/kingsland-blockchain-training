const crypto = require('crypto')
const externalCrypto = require('js-sha3')

class HashCalculator {
    static calculate(algorithmName, message) {
        if (crypto.getHashes().includes(algorithmName)) {
            const hash = crypto.createHash(algorithmName)
            hash.update(message)
            return hash.digest('hex')
        }

        const externalHashes = ['sha3_512', 'sha3_384', 'sha3_256', 'sha3_224',
            'keccak512', 'keccak384', 'keccak256', 'keccak224',
            'shake128', 'shake256', 'cshake128', 'cshake256',
            'kmac128', 'kmac256'
        ]

        if (externalHashes.includes(algorithmName)) {
            const hash = externalCrypto[algorithmName].create()
            hash.update(message)
            return hash.hex()
        }

        throw new Error(`No implementation for ${algorithmName} algorithm`)
    }
}

module.exports = HashCalculator