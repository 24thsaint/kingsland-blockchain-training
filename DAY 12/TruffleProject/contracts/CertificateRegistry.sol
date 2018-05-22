pragma solidity ^0.4.21;

contract CertificateRegistry {
    mapping (string => bool) private certificates;
    address private registryOwner = msg.sender;

    event NewCertificate(string hash);

    function add(string hash) public {
        require(msg.sender == registryOwner);
        certificates[hash] = true;
        emit NewCertificate(hash);
    }

    function verify(string hash) view public returns (bool) {
        return certificates[hash];
    }
}