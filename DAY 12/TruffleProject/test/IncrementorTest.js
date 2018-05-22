const Incrementor = artifacts.require('./Incrementor.sol');

const runCommand = async function () {
    const incrementor = await Incrementor.deployed();
    await incrementor.increment(100);
    const value = await incrementor.getMagicNumber();
    console.log(value.toNumber());
}

module.exports = runCommand;