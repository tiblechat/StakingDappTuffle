const path = require("path");

//const HDWalletProvider = require("truffle-hdwallet-provider");

//require('dotenv').config()  // Store environment-specific variable from '.env' to process.env

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    // kovan: {
    //   provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY),
    //   network_id: 42,
    //   gas: 3000000,
    //   gasPrice: 10000000000
    // },
  },
  compilers: {
    solc: {
      version: "^0.8.4"
    }
  }
};
