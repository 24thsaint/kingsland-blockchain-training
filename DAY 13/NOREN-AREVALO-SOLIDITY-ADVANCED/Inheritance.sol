pragma solidity ^0.4.21;

contract TerminableAgreement {
    
    address private owner;
    
    constructor(address _owner) public {
        owner = _owner;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    event Destroyed(uint timestamp);
    
    function terminate() public onlyOwner {
        emit Destroyed(now);
        selfdestruct(owner);
    }
}

contract Agreement is TerminableAgreement {
    address private owner;
    uint private balance;
    
    constructor() public TerminableAgreement(msg.sender) {
        owner = msg.sender;
    }
    
    event NewDeposit(address _from, uint _amount);
    event Transfer(address _to, uint _amount);
        
    function deposit() payable public {
        balance += msg.value;
        emit NewDeposit(msg.sender, msg.value);
    }
    
    function send(address _to, uint _amount) public onlyOwner {
        _to.transfer(_amount);
        balance -= _amount;
        emit Transfer(_to, _amount);
    }
    
    function getBalance() view public returns (uint) {
        return balance;
    }
}

