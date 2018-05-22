const SimpleToken = artifacts.require("./SimpleToken.sol");

const runCommand = async function() {
    const simpleToken = await SimpleToken.deployed();
    const ownerBalance = await simpleToken.getBalance(0x9a7d706e1e68034e11c03a29723cee12e787cd8a);
    // console.log(simpleToken);
    console.log(ownerBalance.toNumber());
}

module.exports = runCommand;