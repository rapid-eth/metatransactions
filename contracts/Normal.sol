pragma solidity ^0.5.0;

contract Normal {
    address public owner;

    mapping (address => string) public store;

    constructor () public {
        owner = msg.sender;
    }

    function setStore(string memory s) public {
        store[getSender()] = s;
    }

    function getSender() internal view returns (address) {
        return msg.sender;
    }
}