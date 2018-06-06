const ethers = require('ethers');
const solc = require('solc');
const Contract = ethers.Contract;
const provider = ethers.providers.getDefaultProvider('ropsten');
const fs = require('fs-extra');

const ownerPrivateKey = '0xc7bad76b1c7a741f42748ca5d4012fd9fae5edd40af90b7bcd5b93238e67ae72';

function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

function compileContract(fileName, contractName) {
    const contractStr = readFile(fileName);
    const output = solc.compile(contractStr);
    return output.contracts[':' + contractName];
}

async function deployContract(_privateKey, _fileName, _contractName) {
    const wallet = new ethers.Wallet(_privateKey, provider);
    const contract = compileContract(_fileName, _contractName);
    const byteCode = '0x' + contract.bytecode;
    const abi = contract.interface;
    const deployTransaction = Contract.getDeployTransaction(byteCode, abi);
    const result = await wallet.sendTransaction(deployTransaction);
    console.log('Transaction created!');
    console.log(result);
    console.log('====================================================');
    const contractAddress = ethers.utils.getContractAddress(result);
    console.log('Contract address:');
    console.log(contractAddress);
    const mineResult = await provider.waitForTransaction(result.hash);
    console.log(mineResult);
    return contractAddress;
}

deployContract(ownerPrivateKey, './ArrayOfFacts.sol', 'ArrayOfFacts');

// const result = compileContract('./ArrayOfFacts.sol', 'ArrayOfFacts');
// console.log(result);