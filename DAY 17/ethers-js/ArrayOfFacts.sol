pragma solidity ^0.4.23;

contract ArrayOfFacts {
    string[] private facts;
    address private contractOwner;

    constructor() public {
        contractOwner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == contractOwner);
        _;
    }

    function addFact(string fact) public onlyOwner {
        facts.push(fact);
    }

    function getCount() view public returns (uint) {
        return facts.length;
    }

    function getFact(uint index) view public returns (string) {
        return facts[index];
    }
}