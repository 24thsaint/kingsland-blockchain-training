pragma solidity ^0.4.21;

contract SimpleToken {
    address private ownerAddress = msg.sender;
    mapping (address => uint) private balances;

    constructor(uint _initialSupply) public {
        balances[ownerAddress] = _initialSupply;
    }

    event TransferEvent(address _to, uint _value);

    function transfer(address _to, uint _value) public {
        require(_value > 0);
        require(balances[msg.sender] >= _value);
        // Uint overflow check, no non-negative ==========
        require(balances[_to] + _value >= balances[_to]);
        // ===============================================
        balances[ownerAddress] -= _value;
        balances[_to] += _value;
        emit TransferEvent(_to, _value);
    }

    function getBalance(address _address) view public returns (uint) {
        return balances[_address];
    }

    function getOwnerBalance() view public returns (uint) {
        return balances[ownerAddress];
    }
}