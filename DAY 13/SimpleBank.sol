pragma solidity ^0.4.21;

contract Bank {
    address private owner;
    mapping (address => uint) private accounts;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier validateOverflow() {
        require(accounts[msg.sender] + msg.value >= accounts[msg.sender]);
        _;
    }
    
    modifier validateNonNegative(uint _amount) {
        require(_amount > 0);
        _;
    }
    
    modifier validateWithdrawal(uint _amount) {
        require(balanceInquire(msg.sender) >= _amount);
        _;
    }
    
    event Deposit(address _from, uint _amount);
    event Withdraw(address _account, uint _amount);
    
    function deposit() public payable validateOverflow validateNonNegative(msg.value) returns (uint) {
        accounts[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
        return accounts[msg.sender];
    }
    
    function withdraw(uint _amount) validateNonNegative(_amount) validateWithdrawal(_amount) public returns (uint) {
        msg.sender.transfer(_amount);
        accounts[msg.sender] -= _amount;
        emit Withdraw(msg.sender, _amount);
        return accounts[msg.sender];
    }
    
    function balanceInquire(address _account) view internal returns (uint) {
        return accounts[_account];
    }
    
    function getBalance() view public returns (uint) {
        return balanceInquire(msg.sender);
    }
}