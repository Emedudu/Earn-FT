const nft = artifacts.require("NFTToken");

module.exports = async function (deployer) {
  deployer.deploy(nft);

};
