pragma solidity ^0.6.0;
import "./MetaProxy.sol";

contract MetaWrapper {

    MetaProxy public metaTxProxyContract;

    constructor(MetaProxy meta) public {
        metaTxProxyContract = meta;
    }

    modifier onlyMeta {
        require(msg.sender == address(metaTxProxyContract), "only meta");
        _;
    }

    //override parent
    function getSender() internal virtual view returns (address) {
        address metaSigner = metaTxProxyContract.currentSigner();
        if (metaSigner == address(0)) {
            return msg.sender;
        }
        return metaSigner;
    }

}