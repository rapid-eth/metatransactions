require('module-alias/register')

let mnemonic
try {
  const secrets = require('@root/secrets.json')
  mnemonic = secrets.mnemonic;
} catch (error) {
  console.log("Please set a secrets.json file in the root")
  mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
}

console.log(mnemonic)