pragma solidity ^0.4.21;

contract LemonToken {
    string public name;
    string public symbol;
    uint public decimals;
    uint256 public initialSupply;
    uint256 public totalSupply;
    
    mapping (address => uint) private contributors;
    
    constructor() public {
        name = "LemonToken";
        symbol = "LMN";
        decimals = 18;
        initialSupply = 1000000;
    }
    
    function totalSupply() public view returns (uint256) {
        return totalSupply;
    }
    
    function balanceOf(address who) public view returns (uint256) {
        return contributors[who];
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(contributors[to] + value > contributors[to]);
        contributors[to] += value;    
        totalSupply += value;
        emit Transfer(msg.sender, to, value);
    }
    
    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract LemonCrowdsale {
    uint public startTime;
    uint public endTime;
    uint public rateOfTokensToGivePerEth;
    address public walletToStoreTheEthers;
    LemonToken public lemonToken;
    mapping (address => uint) public contribution;
    
    constructor(uint _startTime, uint _endTime, uint _rate) public {
        startTime = _startTime;
        endTime = _endTime;
        rateOfTokensToGivePerEth = _rate;
        walletToStoreTheEthers = msg.sender;
        lemonToken = new LemonToken();
    }
    
    event TokenSold(address _contributor, uint tokens);
    
    modifier durationCheck() {
        require(block.timestamp < endTime);
        _;
    }
    
    function buyTokens() payable public durationCheck {
        require(msg.value > 0);
        uint tokens = rateOfTokensToGivePerEth * (msg.value / 1 ether);
        lemonToken.transfer(msg.sender, tokens);
        msg.sender.transfer(msg.value);
        contribution[msg.sender] = msg.value;
        emit TokenSold(msg.sender, tokens);
    }
    
    function hasEnded() view public returns (bool) {
        return block.timestamp < endTime;
    }
}