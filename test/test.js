const { assert } = require('chai')

const NFTToken=artifacts.require('./NFTToken')
require('chai')
    .use(require('chai-as-promised'))
    .should()
contract('NFTToken',(accounts)=>{
    let nft,nam,symb,tokenId
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
                await nft.mint(i.toString())
                tokenId= await nft.tokenId()
                assert.equal(tokenId.toString(),`${1+i}`)
                let tokenURI=await nft.tokenURI(tokenId)
                assert.equal(tokenURI,i.toString())
            }
        })
    })
})