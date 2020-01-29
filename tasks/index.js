require('module-alias/register')
const utils = require('@utils');
const ethers = utils.ethers

const normalContract = utils.getDeployedContract('NormalMetaWrapper')
const metaProxyContract = utils.getDeployedContract('MetaProxy')

let deployAccount = utils.ethersAccount(0)

const main = async () => {
    console.log("Running Main Task...")
    let rawSignedMetaTx = await createMetaTx("Hello, MetaTx World!")
    await runMeta(rawSignedMetaTx)
    await checkStoreValue(deployAccount.address)
    console.log("Done")
}
const createMetaTx = async (textToSetStore) => {
    let nonce = await metaProxyContract.nonces(deployAccount.address)
    let metaContract = normalContract.connectMeta(deployAccount.toMetaWallet())
    let rawSignedMetaTx = await metaContract.setStore(textToSetStore, { nonce })
    return rawSignedMetaTx
}

const runMeta = async (rlp) => {
    let anotherAccount = utils.ethersAccount(2)
    let con = metaProxyContract.connect(anotherAccount)
    let tx = await con.proxy(rlp)
    await tx.wait()
    //console.log(tx)
}

const checkStoreValue = async (address) => {
    let storeVal = await normalContract.store(address)
    console.log("Store Value for address: " + storeVal)
}
main();