import React, { useEffect, useRef, useState } from 'react';
import Card from './Card';
import ListedCard from './ListedCard';
import SoldCard from './SoldCard';

const MyListedNFTs=({contracts,
                    Token,
                    account,
                    setLoading,
                    listedInitialRender,
                    setListedInitialRender,
                    listedItems,
                    setListedItems,
                    soldItems,
                    setSoldItems,
                    marketChanged,
                    setMarketChanged
        })=>{
    
    const getAllListedItems=async()=>{
        setLoading(true)
        let res=contracts && await contracts.methods.itemsCount().call()
        let count =parseInt(res)
        let fetchedListedItems=[]
        let fetchedSoldItems=[]
        for (let i=1;i<=count;i++){
            let item=await contracts.methods.itemsForSale(i).call();
            if (item.creator===account){
                let price=await contracts.methods.calc_totalFee(i).call()
                let uri=Token && await Token.methods.tokenURI(item.id).call();
                let response=await fetch(uri)
                let metadata=await response.json()
                if (!item.sold){
                    fetchedListedItems.push({
                        marketId:i,
                        creator:item.creator,
                        name:metadata.nam,
                        description:metadata.description,
                        price:price,
                        image:metadata.imageUri,
                        isOwner:item.creator==account
                    })
                }else{
                    fetchedSoldItems.push({
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
        }
        setLoading(false)
        setListedItems(fetchedListedItems)
        setSoldItems(fetchedSoldItems)     
    }
    const removeNFT=async(marketId)=>{
        await (await contracts&&contracts.methods.removeNFT(marketId).send({from:account,gas:5000000}))
        getAllListedItems()
    }
    useEffect(()=>{
        if (contracts!==''){
            if(listedInitialRender) {
                contracts&&getAllListedItems() // initially called every time, the component renders
                setListedInitialRender(false)
            } 
        }
    },[contracts])
    marketChanged&&getAllListedItems().then(()=>setMarketChanged(false))
    return(
        <div>
            <h2>Listed NFTs</h2>
            <div className='row justify-content-center overflow-auto' style={{'height':'50vh'}}>
                {listedItems.map((obj,i)=>{
                        return <ListedCard
                        key={i} 
                        marketId={obj.marketId}
                        name={obj.name}
                        creator={obj.creator}
                        description={obj.description}
                        price={obj.price}
                        image={obj.image}
                        removeNFT={removeNFT}/>
                        })
                    }
            </div>
            <h2>Sold NFTs</h2>
            <div className='row justify-content-center overflow-auto' style={{'height':'50vh'}}>
                {soldItems.map((obj,i)=>{
                    return <SoldCard
                    key={i}
                    image={obj.image}
                    name={obj.name}
                    description={obj.description}
                    price={obj.price}
                    />
                })}
            </div>
        </div>
    )
}
export default MyListedNFTs;