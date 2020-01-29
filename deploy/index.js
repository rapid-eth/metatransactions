require('module-alias/register')

const utils = require("@utils/index.js");
let deployAccount = utils.ethersAccount(0)

const main = async () => {
    console.log("Deployment not configured yet!")
    await deployExample()
    //await deployOwned()
    await deployNormalMetaWrapper()

}

const deployExample = async () => {
    let exampleParams = []
    const exampleContract = await utils.deployContractAndWriteToFile('MemoryTest', deployAccount, exampleParams)
    console.log("Contract deployed at address: " + exampleContract.address)
}
const deployOwned = async () => {
    const ownedContract = await utils.deployContractAndWriteToFile('OwnedContract', deployAccount, [])
    console.log("Owned Contract deployed at address: " + ownedContract.address)
}

const deployNormalMetaWrapper = async () => {
    const metaC = await utils.deployContractAndWriteToFile('MetaProxy', deployAccount, [])

    const c = await utils.deployContractAndWriteToFile('NormalMetaWrapper', deployAccount, [metaC.address])
    console.log("NormalMetaWrapper Contract deployed at address: " + c.address)
    console.log("MetaProxy Contract deployed at address: " + metaC.address)
}


main();