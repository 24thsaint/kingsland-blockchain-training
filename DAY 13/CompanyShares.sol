pragma solidity ^0.4.21;

contract CompanyShares {
    address private owner;
    uint public initialSupply;
    uint public pricePerShare;
    uint public dividend;
    address[] private shareHolders;
    uint private earnings;
    uint constant private withdrawalFee = 1000 wei;
    
    mapping (address => ShareHolderRecord) private records;
    
    struct ShareHolderRecord {
        uint shares;
        bool isBuyAllowed;
        bool isWithdrawAllowed;
    }
    
    constructor(uint _initialSupply, uint _pricePerShare, uint _dividend) public {
        initialSupply = (_initialSupply);
        pricePerShare = _pricePerShare * 1 szabo;
        dividend = (_dividend) * 1 wei;
        owner = msg.sender;
    }
    
    modifier isParticipantAllowedToBuy() {
        require(records[msg.sender].isBuyAllowed);
        _;
    }
    
    modifier isParticipantAllowedToWithdraw() {
        require(records[msg.sender].isWithdrawAllowed);
        _;
    }
    
    modifier validateNoNegative(uint _amount) {
        require(_amount > 0);
        _;
    }
    
    modifier validateAdditionEdgeCase(uint _amount) {
        require(records[msg.sender].shares + _amount >= records[msg.sender].shares);
        require(initialSupply >= _amount);
        _;
    }
    
    modifier validateSubtractionEdgeCase(uint _amount) {
        require(_amount <= records[msg.sender].shares);
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function getShareHolderCount() view public onlyOwner returns (uint) {
        return shareHolders.length;
    }
    
    function getShareHolderAtIndex(uint _index) view public onlyOwner returns (address) {
        return shareHolders[_index];
    }
    
    function getShare(address _person) view public onlyOwner returns (uint) {
        return records[_person].shares;
    }
    
    function allowParticipant(address _participant) onlyOwner public {
        shareHolders.push(_participant);
        records[_participant] = ShareHolderRecord({
            shares: 0,
            isBuyAllowed: true,
            isWithdrawAllowed: false
        });
    }
    
    function allowParticipantToWithdraw(address _participant) onlyOwner public {
        records[_participant].isWithdrawAllowed = true;
    }
    
    function depositEarnings(uint _amount) onlyOwner public {
        earnings += (_amount) * 1 szabo;
    }
    
    // ===============================
    // Everyone ======================
    
    function calculateSharePrice(address _shareHolder) view internal returns (uint) {
        return records[_shareHolder].shares * pricePerShare;
    }
    
    function buyShares(uint _amount) payable public isParticipantAllowedToBuy validateNoNegative(_amount) validateAdditionEdgeCase(_amount) returns (uint) {
        require(getQuote(_amount) == msg.value);
        records[msg.sender].shares += _amount;
        initialSupply -= _amount;
        return records[msg.sender].shares;
    }
    
    function withdrawFunds(uint _amount) public isParticipantAllowedToWithdraw validateNoNegative(_amount) validateAdditionEdgeCase(_amount) returns (uint) {
        require((_amount * 1 szabo) <= calculateSharePrice(msg.sender));
        uint withdrawalAmount = _amount * 1 szabo;
        uint deductedShare = calculateSharePrice(msg.sender) / withdrawalAmount;
        records[msg.sender].shares -= deductedShare;
        return withdrawalAmount - withdrawalFee;
    }
    
    function getQuote(uint _amount) view public returns (uint) {
        return _amount * pricePerShare;
    }
}