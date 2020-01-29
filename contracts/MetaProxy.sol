pragma solidity ^0.5.13;
pragma experimental ABIEncoderV2;

import "./Solidity-RLP/RLPReader.sol";

contract MetaProxy {
    using RLPReader for RLPReader.RLPItem;
    using RLPReader for bytes;

    address public currentSigner;
    mapping (address => uint256) public nonces;

    struct MetaTransaction {
        uint nonce;
        address to;
        uint expires;
        bytes data;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    function proxy(bytes memory rawMetaTx) public {
        //parse meta tx
        MetaTransaction memory t = rawToMetaTx(rawMetaTx);
        require(t.expires > block.timestamp, "metatx expired");

        //verify signature
        address signer = verifySigner(t);

        require(t.nonce == nonces[signer]++, "invalid nonce");

        currentSigner = signer;

        (bool success, ) = t.to.call(t.data);
        require(success, "Error executing tx");

        currentSigner = address(0x0);
    }

    function rawToMetaTx(bytes memory rawMetaTx) public pure returns (MetaTransaction memory mtx) {
        RLPReader.RLPItem[] memory ls = rawMetaTx.toRlpItem().toList();

        mtx.nonce = ls[0].toUint();
        mtx.to = ls[1].toAddress();
        mtx.expires = ls[2].toUint();
        mtx.data = ls[3].toBytes();
        mtx.v = uint8(ls[4].toUint());
        mtx.r = bytes32(ls[5].toUint());
        mtx.s = bytes32(ls[6].toUint());
    }

    function verifySigner(MetaTransaction memory _tx) public pure returns (address) {
        bytes32 rawHash = keccak256(abi.encodePacked(_tx.nonce, _tx.to, _tx.expires, _tx.data));
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, rawHash));
        return ecrecover(prefixedHash, _tx.v, _tx.r, _tx.s);
    }

    // function testVerify(bytes memory rawMetaTx) public view returns (address) {
    //     //parse meta tx
    //     MetaTransaction memory t = rawToMetaTx(rawMetaTx);
    //     //verify signature
    //     address signer = verifySigner(t);
    //     return signer;
    // }

}