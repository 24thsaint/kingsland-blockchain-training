const PreviousInvoker = artifacts.require("./PreviousInvoker.sol");

const runCommand = async function() {
    const previousInvoker = await PreviousInvoker.deployed();
    const lastInvoker = await previousInvoker.getLastInvoker();
    console.log(lastInvoker);
}

module.exports = runCommand;