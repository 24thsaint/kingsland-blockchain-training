pragma solidity ^0.4.21;

contract Deposit {
    address private owner;
    uint private balance;
    
    constructor() public {
        owner = msg.sender;
    }
    
    event DepositSuccess(address _sender, uint _amount);
    event ContractDestroyed(address _owner, uint _balance);
    
    function() public payable {
        balance += msg.value;
        emit DepositSuccess(msg.sender, msg.value);
    }
    
    function getBalance() view public returns (uint) {
        return balance;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function send() public onlyOwner {
        owner.transfer(balance);
        emit ContractDestroyed(owner, balance);
        
        selfdestruct(owner);
    }
}