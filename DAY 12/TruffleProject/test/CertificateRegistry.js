const SHA256 = require("crypto-js/sha256");
const CertificateRegistry = artifacts.require("./CertificateRegistry.sol");

const runCommand = async function() {
    const certificateRegistry = await CertificateRegistry.deployed();

    certificateRegistry.NewCertificate(function(error, result) {
        if (!error)
            console.log(result);
    });
    
    const sha256Msg = SHA256("Hello").toString();
    const sha256MsgAltered = SHA256("Hola!").toString();

    await certificateRegistry.add(sha256Msg);
    
    const verify = await certificateRegistry.verify(sha256Msg);
    const verify2 = await certificateRegistry.verify(sha256MsgAltered);
    console.log("Certificate #1:", verify);
    console.log("Certificate #2:", verify2);
}

module.exports = runCommand;