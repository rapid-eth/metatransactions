pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./Normal.sol";
import "./MetaWrapper.sol";
import "./MetaProxy.sol";

contract NormalMetaWrapper is Normal, MetaWrapper {

    constructor(MetaProxy meta) MetaWrapper(meta) public { }

    function getSender() internal override(Normal, MetaWrapper) view returns (address) {
        return MetaWrapper.getSender();
    }

}