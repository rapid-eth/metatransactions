require('module-alias/register')

const utils = require("@utils/index.js");
let deployAccount = utils.ethersAccount(0)

const main = async () => {
    await deployNormalMetaWrapper()
}

const deployNormalMetaWrapper = async () => {
    const metaC = await utils.deployContractAndWriteToFile('MetaProxy', deployAccount, [])
    const c = await utils.deployContractAndWriteToFile('NormalMetaWrapper', deployAccount, [metaC.address])
    console.log("NormalMetaWrapper Contract deployed at address: " + c.address)
    console.log("MetaProxy Contract deployed at address: " + metaC.address)
}


main();