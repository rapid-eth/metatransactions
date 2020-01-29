pragma solidity ^0.5.0;

import "./Normal.sol";
import "./MetaWrapper.sol";
import "./MetaProxy.sol";

contract NormalMetaWrapper is Normal, MetaWrapper {

    constructor(MetaProxy meta) MetaWrapper(meta) public { }

}