pragma solidity ^0.4.18;

contract SimpleStorage {
    uint private storedData;

    function set(uint _x) public {
        storedData = _x;
    }

    // function get() constant public returns (uint)
    // 'constant' is deprecated, use 'view'
    function get() view public returns (uint) {
        return storedData;
    }
}