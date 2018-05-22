pragma solidity ^0.4.21;

contract LamboCrowdSale {
    address private owner;
    uint private balance;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function deposit() public payable {
        require(balance + msg.value >= balance);
        
        balance += msg.value;
    }
    
    function getBalance() view public onlyOwner returns (uint) {
        return balance;
    }
    
    function runAway() public onlyOwner {
        msg.sender.transfer(balance);
        selfdestruct(owner);
    }
}