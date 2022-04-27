const nft = artifacts.require("NFTToken");

module.exports = function (deployer) {
  deployer.deploy(nft);
};
