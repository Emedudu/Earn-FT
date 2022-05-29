const MarketPlace = artifacts.require("MarketPlace");
// const nft=artifacts.require("NFTToken");

module.exports = async (deployer) => {
    // const nft_address=await nft.deployed();
    const accounts= await web3.eth.getAccounts()
    // console.log(nft_address.address);
    await deployer.deploy(MarketPlace,10,{from:accounts[0]});
};
