var ethers = require('ethers')
const SigningKey = ethers.utils.SigningKey
const checkProperties = ethers.utils.checkProperties
const defineReadOnly = ethers.utils.defineReadOnly
const shallowCopy = ethers.utils.shallowCopy
const resolveProperties = ethers.utils.resolveProperties
const hexlify = ethers.utils.hexlify
const arrayify = ethers.utils.arrayify
const splitSignature = ethers.utils.splitSignature
const solidityKeccak256 = ethers.utils.solidityKeccak256
const RLP = ethers.utils.RLP
const setMetaType = require('./utils').setMetaType
const Provider = ethers.providers.Provider

var allowedMetaTransactionKeys = {
    chainId: true, data: true, from: true, expiration: true, nonce: true, to: true
};


function populateMetaTransaction(transaction, provider, from) {
    if (!Provider.isProvider(provider)) {
        errors.throwError('missing provider', errors.INVALID_ARGUMENT, {
            argument: 'provider',
            value: provider
        });
    }
    checkProperties(transaction, allowedMetaTransactionKeys);
    var tx = shallowCopy(transaction);
    if (tx.to != null) {
        tx.to = provider.resolveName(tx.to);
    }
    if (tx.expiration == null) {
        tx.expiration = hexlify(9999999999)
    }
    if (tx.nonce == null) {
        //TODO
        console.log("please pass nonce in manually for now")
        //tx.nonce = provider.getTransactionCount(from);
    }
    if (tx.chainId == null) {
        tx.chainId = provider.getNetwork().then(function (network) { return network.chainId; });
    }
    return resolveProperties(tx);
}

class MetaWallet extends ethers.Wallet {

    constructor(privateKey, provider) {
        super(privateKey,provider);
        setMetaType(this, 'MetaSigner');
    }
    

    isMetaSigner = function (value) {
        return isType(value, 'MetaSigner');
    };

    signMetaTransaction = function (transaction) { 
        var _this = this;
        console.log("attempting to sign meta tx")
        return populateMetaTransaction(transaction, this.provider, this.address).then(function (tx) {

            console.log(_this.address)
            console.log(tx)
            //hash it
            let hash = solidityKeccak256(['uint', 'address', 'uint', 'bytes'], [tx.nonce, tx.to, tx.expiration, tx.data]);
            console.log("hasn", hash)

            //sign it
            return _this.signMessage(arrayify(hash)).then(function (signature) {

                let splitSig = splitSignature(signature)

                let mtxArray = [
                    hexlify(transaction.nonce),
                    tx.to,
                    tx.expiration,
                    tx.data,
                    hexlify(splitSig.v),
                    splitSig.r,
                    splitSig.s
                ]

                return RLP.encode(mtxArray)
            });
        })
    }

}

exports.MetaWallet = MetaWallet
