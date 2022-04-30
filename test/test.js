const { assert } = require('chai')

const NFTToken=artifacts.require('./NFTToken')
const MarketPlace=artifacts.require('./MarketPlace')

const toWei=(eth)=>{return (web3.utils.toWei(eth))}

require('chai')
    .use(require('chai-as-promised'))
    .should()

let nft,nam,symb,tokenId


contract('tests',(accounts)=>{
    before(async()=>{
        nft= await NFTToken.deployed()
        nam= await nft.name()
        symb=await nft.symbol()
    })
    describe('NFTToken',()=>{
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
    describe('MarketPlace',()=>{
        let marketplace,marketAddress,feeBank,bankamt
        beforeEach(async()=>{
            marketplace=await MarketPlace.deployed();
            marketAddress=await marketplace.address;
            nft.setApprovalForAll(marketAddress,true,{from:accounts[1]})
            feeBank=await marketplace.feeBank();
            bankamt=await web3.eth.getBalance(feeBank)
        })
        
        describe('check constructor variables',()=>{
            it('should have stated feebank and percentage',async()=>{
                // 0x28271624D07061f0bf6B477dAf00233805549e3f
                let feebank=await marketplace.feeBank()
                let percentage= await marketplace.percentage()
                // console.log(feebank,accounts[0])
                assert.equal(feebank,accounts[3])
                assert.equal(percentage,10)
            })
        })
        
        describe('checking uploadNFT function',()=>{
            it('should make sure nft is uploaded',async()=>{
                const result=await marketplace.uploadNFT(nft.address,1,toWei('1.5'),"Number",{from:accounts[1]});
                let itemForSale=await marketplace.itemsForSale(1);
                // let count=await marketplace.itemsCount();
                // console.log(itemForSale);
                let item=await marketplace.itemId_Item(itemForSale);
                let creator=await item.creator;
                assert.equal(creator,accounts[1]);
                assert.equal(result.logs[0].args.price,toWei('1.5'));
                assert.equal(result.logs[0].args.name,"Number")
            })
        })
        describe('checking buyNFT function',()=>{
            // before(async()=>{
            //     await marketplace.uploadNFT(nft.address,1,toWei('1.5'),{from:accounts[1]})
            // })
            it('should make sure purchase is successful',async()=>{
                let fee=await marketplace.calc_totalFee(1);
                const result=await marketplace.buyNFT(1,{from:accounts[2],value:fee});
                let balBuyer=await web3.eth.getBalance(accounts[2]);
                let balSeller=await web3.eth.getBalance(accounts[1]);
                assert(balBuyer<(toWei('100')-fee),'fee was not deducted');  
                let balBank=await web3.eth.getBalance(feeBank);
                console.log(bankamt,balBank)
                assert(balBank>bankamt,"fee was not paid to the bank");
                assert(balSeller>toWei('100'),"seller account should be credited");
                // assert(balBuyer<toWei('100'),'buyer account should be debited')
                console.log(balBank,balSeller,balBuyer);
                let owner=await nft.ownerOf(1);
                assert.equal(owner,accounts[2])
                assert(owner!=accounts[1],'nft already transferred')
                assert.equal(result.logs[0].args.price,toWei('1.5'))
                assert.equal(result.logs[0].args.name,"Number")

            })
        })
    })
})
