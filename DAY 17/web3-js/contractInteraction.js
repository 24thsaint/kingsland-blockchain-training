const Web3 = require('web3');
const provider = 'https://ropsten.infura.io/TsF0xHHbgbCoGTyEBO4A ';
let web3 = new Web3(new Web3.providers.HttpProvider(provider));

const address = '0xC3615798305ae7FAc0e97242153ffE46C61121Fb';
const privateKey = '0xc7bad76b1c7a741f42748ca5d4012fd9fae5edd40af90b7bcd5b93238e67ae72';

const abi = [{
    "constant": false,
    "inputs": [{
        "name": "fact",
        "type": "string"
    }],
    "name": "addFact",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getCount",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "index",
        "type": "uint256"
    }],
    "name": "getFact",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}]

async function addFact(_privateKey, _abi, contractAddress, fact) {
    web3.eth.accounts.wallet.add(_privateKey);
    const contract = new web3.eth.Contract(_abi, contractAddress);
    const result = await contract.methods.addFact(fact).send({
        from: web3.eth.accounts.wallet[0].address,
        gas: 4700000
    }, function (err, txId) {
        if (err) {
            console.log(err);
        }
        console.log("TxHash: " + txId);
    })
    console.log('Transaction Information', result);
}

addFact(privateKey, abi, address, "June 3, 2018 - Duterte's controversial kiss makes headlines worldwide");

// Unauthorized address
// addFact('0xdcfe598efb66655fe10574c01b0b7d0b0e8a5376a16fdeed42b51f37ce39fd2e', abi, address, "June 3, 2018 - Duterte's controversial kiss makes headlines worldwide");

// 0xee8cb43101818343f2045b8335c9cfcc096f5361cacdb04ed374c4995195bab3 , success!
// fail address pending.

async function getFact(_privateKey, _abi, contractAddress, index) {
    web3.eth.accounts.wallet.add(_privateKey);
    const contract = new web3.eth.Contract(_abi, contractAddress);
    const result = await contract.methods.getFact(index).call({
        from: web3.eth.accounts.wallet[0].address
    });
    console.log(`FACT: ${index} - ${result}`);
}

// getFact(privateKey, abi, address, 0);

async function getFactsCount(_privateKey, _abi, contractAddress) {
    web3.eth.accounts.wallet.add(_privateKey);
    const contract = new web3.eth.Contract(_abi, contractAddress);
    try {
        const result = await contract.methods.getCount().call({
            from: web3.eth.accounts.wallet[0].address
        });
        console.log('Stored facts in the contract: ', result);
    } catch (e) {
        console.log(e);
    }
}

// getFactsCount(privateKey, abi, address);