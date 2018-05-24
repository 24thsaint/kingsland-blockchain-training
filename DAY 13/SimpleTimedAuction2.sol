pragma solidity ^0.4.21;

contract TimedAuction2 {
    address private owner;
    mapping (address => uint) private purchases;
    uint public unsoldTokens;
    uint public startBlock;
    uint public endBlock;
    
    constructor(uint _unsoldTokens) public {
        owner = msg.sender;
        unsoldTokens = _unsoldTokens;
        startBlock = block.number;
        endBlock = startBlock + 1;
    }
    
    modifier validateAmounts(uint _amount) {
        require(purchases[msg.sender] + _amount >= purchases[msg.sender]);
        require(_amount > 0);
        require(_amount <= unsoldTokens);
        _;
    }
    
    modifier checkIfAuctionHasExpired() {
        require(block.number == endBlock);
        _;
    }
    
    event TokenPurchase(address _account, uint _amount);
    
    function buyTokens(uint _amount) public validateAmounts(_amount) checkIfAuctionHasExpired {
        purchases[msg.sender] += _amount;
        unsoldTokens -= _amount;
        emit TokenPurchase(msg.sender, _amount);
    }
}