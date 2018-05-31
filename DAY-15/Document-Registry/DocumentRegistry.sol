pragma solidity ^0.4.21;

contract DocumentRegistry {
    struct Document {
        string hash;
        uint dateAdded;
    }
    
    Document[] private documents;
    address contractOwner;
    
    modifier onlyOwner() {
        require(msg.sender == contractOwner);
        _;
    }
    
    constructor() public {
        contractOwner = msg.sender;
    }
    
    function add(string hash) public onlyOwner returns (uint dateAdded) {
        dateAdded = block.timestamp;
        documents.push(Document(hash, dateAdded));
    }
    
    function getDocumentsCount() view public returns(uint) {
        return documents.length;
    }
    
    function getDocument(uint index) view public returns (string, uint) {
        Document storage document = documents[index];
        return (document.hash, document.dateAdded);
    }
}