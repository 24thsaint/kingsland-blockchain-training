const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs-extra');
// const provider = 'https://ropsten.infura.io/TsF0xHHbgbCoGTyEBO4A';
const provider = 'https://infuranet.infura.io/TsF0xHHbgbCoGTyEBO4A';
let web3 = new Web3(new Web3.providers.HttpProvider(provider));

const privateKey = '0xc7bad76b1c7a741f42748ca5d4012fd9fae5edd40af90b7bcd5b93238e67ae72';

function readFile(fileName) {
    return fs.readFileSync(fileName,'utf8');
}

function compileContract(fileName, contractName) {
    let contractStr = readFile(fileName);
    let output = solc.compile(contractStr);
    return output.contracts[':' + contractName];
}

async function deployContract(privateKey, filePath, contractName) {
    // web3.eth.accounts.wallet.add(privateKey);

    let compiledContract = compileContract(filePath, contractName);
    let abi = compiledContract.interface;
    let byteCode = '0x' + compiledContract.bytecode;

    let contract = new web3.eth.Contract(JSON.parse(abi), null, {
        data: byteCode,
        from: web3.eth.accounts.wallet[0].address,
        gas: 4600000
    });

    const result = await contract.deploy().send();
    console.log(result);
}

deployContract(privateKey, './ArrayOfFacts.sol', 'ArrayOfFacts');
// const x = compileContract('./ArrayOfFacts.sol', 'ArrayOfFacts');
// console.log(x.interface);