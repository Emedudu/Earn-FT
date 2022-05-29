require('babel-register');
require('babel-polyfill');
require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.MNEMONIC;
var RINKEBY_INFURA= process.env.RINKEBY_INFURA;
var RINKEBY_ALCHEMY= process.env.RINKEBY_ALCHEMY;
var GOERLI_ALCHEMY= process.env.GOERLI_ALCHEMY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      websockets:true
    },
    rinkeby_infura: {
      networkCheckTimeout:100000,
      provider: function() { 
       return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/ws/v3/${RINKEBY_INFURA}`);
      },
      network_id: 4,
      gas: 6700000,
      gasPrice: 10000000000,
    },
    rinkeby_alchemy: {
      networkCheckTimeout:100000,
      provider: function() { 
       return new HDWalletProvider(mnemonic, `https://eth-rinkeby.alchemyapi.io/v2/${RINKEBY_ALCHEMY}`);
      },
      network_id: 4,
      // gas: 6700000,
      // gasPrice: 10000000000,
    },
    goerli: {
      networkCheckTimeout:100000,
      provider: function() { 
       return new HDWalletProvider(mnemonic, `https://eth-goerli.alchemyapi.io/v2/${GOERLI_ALCHEMY}`);
      },
      network_id: 5,
      // gas: 6700000,
      // gasPrice: 10000000000,
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version:"^0.8.0",
      settings:{
        optimizer: {
          enabled: true,
          runs: 200
        }
      }

    }
  }
}
