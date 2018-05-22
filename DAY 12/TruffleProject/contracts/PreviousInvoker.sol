pragma solidity ^0.4.21;

contract PreviousInvoker {
    address private lastInvoker;

    function getLastInvoker() public returns (bool, address) {
        address _lastInvoker = lastInvoker;
        bool responseBool = (_lastInvoker != address(0x0));
        lastInvoker = msg.sender;
        return (responseBool, msg.sender);
    }
}