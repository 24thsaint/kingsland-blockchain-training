const Incrementor = artifacts.require("./Incrementor.sol");
const PreviousInvoker = artifacts.require("./PreviousInvoker.sol");
const CertificateRegistry = artifacts.require("./CertificateRegistry.sol");
const SimpleToken = artifacts.require("./SimpleToken.sol");
const Diary = artifacts.require("./Diary.sol");
const StudentRegistry = artifacts.require("./StudentRegistry.sol");

module.exports = function(deployer) {
    deployer.deploy(Incrementor);
    deployer.deploy(PreviousInvoker);
    deployer.deploy(CertificateRegistry);
    deployer.deploy(SimpleToken, 1234567890);
    deployer.deploy(Diary);
    deployer.deploy(StudentRegistry);
}