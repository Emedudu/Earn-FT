import React, { useEffect, useState } from 'react';
import Card from './Card';

const Home=({contracts,
            Token,
            account,
            setMessage,
            setLoading,
            allItems,
            setAllItems,
            marketChanged,
            setMarketChanged
        })=>{
        
    const getAllItems=async()=>{
        setLoading(true)
        let res=contracts && await contracts.methods.itemsCount().call()
        let count =parseInt(res)
        let itemsFetched=[]
        for (let i=1;i<=count;i++){
            let item=await contracts.methods.itemsForSale(i).call();
            if (!item.sold){
                let price=await contracts.methods.calc_totalFee(i).call()
                let uri=Token && await Token.methods.tokenURI(item.id).call();
                let response=await fetch(uri)
                let metadata=await response.json()
                console.log(price)
                itemsFetched.push({
                    marketId:i,
                    creator:item.creator,
                    name:metadata.nam,
                    description:metadata.description,
                    price:price,
                    image:metadata.imageUri,
                    isOwner:item.creator==account
                })
            }
        }
        setAllItems(itemsFetched)
        setLoading(false)
    }
    const buyNFT=async(marketId,price)=>{
        await (await contracts&&contracts.methods.buyNFT(marketId).send({from:account,value:price,gas:5000000}))
        getAllItems()
    }
    const removeNFT=async(marketId)=>{
        await (await contracts&&contracts.methods.removeNFT(marketId).send({from:account,gas:5000000}))
        getAllItems()
    }
    marketChanged&&getAllItems().then(()=>setMarketChanged(false))
    contracts&&contracts.events.Bought({filter:{adress:account}})
        .on('data',event=>{
            setMessage(`You just bought ${event.returnValues}`)
            getAllItems()
        })
    contracts&&!allItems[0]&&getAllItems()
    return(
        <div>
            <div className='row justify-content-center'>
                {allItems.map((obj,i)=>{
                        return <Card
                        key={i} 
                        marketId={obj.marketId}
                        name={obj.name}
                        creator={obj.creator}
                        description={obj.description}
                        price={obj.price}
                        image={obj.image}
                        isOwner={obj.isOwner}
                        contract={contracts}
                        account={account}
                        buyNFT={buyNFT}
                        removeNFT={removeNFT}/>
                        })
                    }
            </div>
        </div>
    )
}
export default Home;