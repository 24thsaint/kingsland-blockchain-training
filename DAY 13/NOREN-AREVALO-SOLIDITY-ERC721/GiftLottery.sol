pragma solidity ^0.4.24;

import "./ERC721/ERC721Token.sol";

contract GiftLottery is ERC721Token {
    address owner;
    address[] participants;
    uint endTime;
    mapping (address => bool) distributionList;
    
    struct Gift {
        string title;
        string description;
        string URL;
    }
    
    mapping (uint => Gift) giftIdToGift;
    
    constructor(uint _endTime) ERC721Token("GiftLottery", "GLT") public {
        endTime = _endTime;
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    event CreateGift(address indexed participant, uint giftId);
    event ReceiveGift(address indexed winner, uint giftId);
    
    function createGift(string _title, string _description, string _URL) external {
        require(endTime >= now);
        uint index = allTokens.length.add(1);
        _mint(owner, index);
        giftIdToGift[index] = Gift(_title, _description, _URL);
        participants.push(msg.sender);
        emit CreateGift(msg.sender, index);
    }
    
    function pseudoRandom(uint _giftId) private view returns (uint) {
        Gift memory gift = giftIdToGift[_giftId];
        return uint(keccak256(abi.encodePacked(gift.title, gift.description, gift.URL, _giftId))) % participants.length;
    }
    
    function distributeGifts() public onlyOwner {
        for (uint i = 1; i <= allTokens.length; i++) {
            uint randomAddress = pseudoRandom(i);
            address winner = participants[randomAddress];
            uint tempIndex;
            while (distributionList[winner] == true && tempIndex < participants.length * 2) {
                tempIndex++;
                winner = participants[(randomAddress + tempIndex) % participants.length];
            }
            distributionList[winner] = true;
            transferFrom(msg.sender, winner, i);
            emit ReceiveGift(winner, i);
        }
    }
}