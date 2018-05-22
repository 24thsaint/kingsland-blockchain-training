pragma solidity ^0.4.21;

contract Diary {

    address private owner = msg.sender;
    address private approvedAddress;
    Fact[] private facts;

    constructor() public {
        approvedAddress = 0x0081017bfecf9932982f21db5c7c81817f88b3a664;
    }

    struct Fact {
        uint timestamp;
        string fact;
    }

    modifier onlyBy(address _owner) {
        require(msg.sender == _owner);
        _;
    }

    modifier onlyApproved() {
        require(msg.sender == approvedAddress || msg.sender == owner);
        _;
    }

    event NewEntry(uint _timestamp, string _fact);

    function addFact(uint _timestamp, string _fact) public onlyBy(owner) {
        facts.push(Fact({
            timestamp: _timestamp,
            fact: _fact
        }));
        emit NewEntry(_timestamp, _fact);
    }

    function getFact(uint _index) view public onlyApproved returns (string) {
        return facts[_index].fact;
    }

    function count() view public returns (uint) {
        return facts.length;
    }
}