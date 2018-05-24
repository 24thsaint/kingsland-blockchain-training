pragma solidity ^0.4.21;

contract TimedAuction {
    address private owner;
    uint public startTime;
    uint constant public duration = 60 seconds;
    uint public endTime;
    mapping (address => uint) private purchases;
    uint public tokensToSell;
    
    constructor(uint _tokensToSell) public {
        owner = msg.sender;
        tokensToSell = _tokensToSell;
        startTime = block.timestamp; // also 'now' as alias.
        endTime = startTime + duration; // native conversion, 60 sec = 60,000 ms
    }
    
    modifier validateAmounts(uint _amount) {
        require(purchases[msg.sender] + _amount >= purchases[msg.sender]);
        require(_amount > 0);
        require(_amount <= tokensToSell);
        _;
    }
    
    modifier checkIfAuctionHasExpired() {
        require(now < endTime);
        _;
    }
    
    event TokenPurchase(address _account, uint _amount);
    
    function buyTokens(uint _amount) public validateAmounts(_amount) checkIfAuctionHasExpired {
        purchases[msg.sender] += _amount;
        tokensToSell -= _amount;
        emit TokenPurchase(msg.sender, _amount);
    }
}