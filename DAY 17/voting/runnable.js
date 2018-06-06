const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const fs = require('fs');
const solc = require('solc');

async function run() {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const code = fs.readFileSync('./contracts/Voting.sol').toString();
    console.log(code);
    const compiledCode = solc.compile(code);
    const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
    const VotingContract = new web3.eth.Contract(abiDefinition, {
        from: accounts[0],
        gas: 4700000
    });
    const byteCode = compiledCode.contracts[':Voting'].bytecode;
    const instance = await VotingContract.deploy({
        data: byteCode
    }).send({
        from: accounts[0],
        gas: 4700000
    });
    console.log(instance);
    const result1 = await instance.methods.addCandidate('Sevgin').send({
        from: accounts[1]
    });
    const result2 = await instance.methods.addCandidate('Svetlio').send({
        from: accounts[1]
    });
    console.log(result1);
    console.log('================================================');
    console.log(result2);
    console.log('================================================');
    await instance.methods.voteForCandidate('Svetlio').send({
        from: accounts[1]
    });
    await instance.methods.voteForCandidate('Svetlio').send({
        from: accounts[3]
    });
    await instance.methods.voteForCandidate('Sevgin').send({
        from: accounts[2]
    });
    console.log('=================================================');
    const count1 = await instance.methods.totalVotesFor('Svetlio').call({
        from: accounts[1]
    });
    const count2 = await instance.methods.totalVotesFor('Sevgin').call({
        from: accounts[1]
    });
    console.log(count1);
    console.log('==================================================')
    console.log(count2);
}

run();