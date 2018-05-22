pragma solidity ^0.4.21;

contract Incrementor {
    uint private magicNumber;

    function increment(uint _nonMagicalNumber) public {
        magicNumber += _nonMagicalNumber;
    }

    function getMagicNumber() view public returns (uint) {
        return magicNumber;
    }
}