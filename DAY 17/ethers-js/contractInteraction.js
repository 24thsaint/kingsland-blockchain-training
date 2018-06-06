const ethers = require('ethers');
const solc = require('solc');
const Contract = ethers.Contract;
const provider = ethers.providers.getDefaultProvider('ropsten');
const fs = require('fs-extra');

const ownerPrivateKey = '0xc7bad76b1c7a741f42748ca5d4012fd9fae5edd40af90b7bcd5b93238e67ae72';
const contractAddress = '0xF969582BD3B1bC8fc0c04F2d614d159180E8DcFE';

function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

function compileContract(fileName, contractName) {
    const contractStr = readFile(fileName);
    const output = solc.compile(contractStr);
    return output.contracts[':' + contractName];
}

function getAbi(_fileName, _contractName) {
    const contract = compileContract(_fileName, _contractName);
    const abi = contract.interface;
    return abi;
}

async function addFact(_privateKey, _abi, _contractAddress, _fact) {
    const wallet = new ethers.Wallet(_privateKey, provider);
    const contract = new ethers.Contract(_contractAddress, _abi, wallet);

    const response = await contract.addFact(_fact);
    console.log('Transaction: ');
    console.log(response);

    const txResult = await provider.waitForTransaction(response.hash);
    console.log(txResult);

    return {response, txResult};
}

// const fact = 'June 06 2018 - Ethereum Price Forecast: How High Can The Price Of Ethereum Go? - Ethereum News Today';

// addFact(ownerPrivateKey, getAbi('./ArrayOfFacts.sol', 'ArrayOfFacts'), contractAddress, fact);

// const unauthorizedPrivateKey = '0x4f8e7e252446e467e2beed3a52bb1462dfef10f04c56e14f6d0786061453063d';
// addFact(unauthorizedPrivateKey, getAbi('./ArrayOfFacts.sol', 'ArrayOfFacts'), contractAddress, fact);

async function getFact(_provider, _abi, _contractAddress, _index) {
    const contract = new ethers.Contract(_contractAddress, _abi, _provider);
    const result = await contract.getFact(_index);
    console.log(`Fact [${_index}] - ` + result);
    return result;
}

// getFact(provider, getAbi('./ArrayOfFacts.sol', 'ArrayOfFacts'), contractAddress, 0);

async function getFactsCount(_provider, _abi, _contractAddress) {
    const contract = new ethers.Contract(_contractAddress, _abi, _provider);
    const result = await contract.getCount();
    console.log('Total facts: ' + ethers.utils.bigNumberify(result).toNumber());
    return result;
}

getFactsCount(provider, getAbi('./ArrayOfFacts.sol', 'ArrayOfFacts'), contractAddress);