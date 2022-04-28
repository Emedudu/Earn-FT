const { assert } = require('chai')

const NFTToken=artifacts.require('./NFTToken')
const MarketPlace=artifacts.require('./MarketPlace')
const toWei=(eth)=>{return (web3.utils.toWei(eth))}
require('chai')
    .use(require('chai-as-promised'))
    .should()
let nft
contract('NFTToken',(accounts)=>{
    let nam,symb,tokenId
    beforeEach(async()=>{
        nft= await NFTToken.deployed()
        nam= await nft.name()
        symb=await nft.symbol()
    })
    describe('check token creation and functions',()=>{
        it('should have correct name and symbol',()=>{
            assert.equal(nam,'NFTToken')
            assert.equal(symb,'NFT')
        })
        it('should have correct tokenId mapped to a tokenURI',async()=>{
            for (let i=0;i<3;i++){
                await nft.mint(i.toString(),{from:accounts[1]})
                tokenId= await nft.tokenId()
                assert.equal(tokenId.toString(),`${1+i}`)
                let tokenURI=await nft.tokenURI(tokenId)
                assert.equal(tokenURI,i.toString())
            }
        })
    })
})
contract('MarketPlace',(accounts)=>{
    let marketplace
    before(async()=>{
        marketplace=await MarketPlace.deployed();
        nft.setApprovalForAll(marketplace.address,true)
    })
    
    describe('check constructor variables',()=>{
        it('should have stated feebank and percentage',async()=>{
            // 0x28271624D07061f0bf6B477dAf00233805549e3f
            let feebank=await marketplace.feeBank()
            let percentage= await marketplace.percentage()
            console.log(feebank,accounts[0])
            assert.equal(feebank,accounts[0])
            assert.equal(percentage,1)
        })
    })
    
    describe('checking uploadNFT function',()=>{
        it('should make sure nft is uploaded',async()=>{
            const result=await marketplace.uploadNFT(nft.address,2,toWei('1.5'),{from:accounts[1]});
            // let item=await marketplace.itemId_Item[itemsForSale[1]];
            // let creator=await item.creator
            console.log(result)
            // assert.equal(creator,accounts[0]);
        })
        
    })
})
