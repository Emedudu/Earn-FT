import React, { useEffect, useState } from 'react';
import BoughtCard from './BoughtCard';

const BoughtNFT=({contracts,
                account,
                Token,
                purchases,
                setPurchases,
                marketChanged,
                boughtInitialRender,
                setBoughtInitialRender,
                setLoading})=>{
    
    const getBoughtNFTs=()=>{
        setLoading(true)
        contracts&&contracts.getPastEvents('Bought',{
            filter:{adress:account},
            fromBlock:0,
            toBlock:'latest'
        })
        .then(async(events)=>{
            const boughtItems=await Promise.all(events.map(async obj=>{
                obj=obj.returnValues
                const uri=await(await Token&&Token.methods.tokenURI(obj.itemId).call())
                const response=await fetch(uri)
                const metadata=await response.json()
                const totalPrice=await contracts.methods.calc_totalFee(obj.itemId).call()
                let res={
                    totalPrice,
                    name:metadata.nam,
                    description:metadata.description,
                    image:metadata.imageUri,
                }
                return(res)
            }))
            setLoading(false)
            setPurchases(boughtItems)
        })
    }
    useEffect(()=>{
        if(contracts!==''){
            if (boughtInitialRender) {
                getBoughtNFTs() // initially called every time, the component renders
                setBoughtInitialRender(false);
            } 
        }
    },[contracts])
    contracts&&marketChanged&&getBoughtNFTs()
    return(
        <div>
            <div className='row justify-content-center'>
                {purchases.map((obj,i)=>{
                        return <BoughtCard
                        key={i} 
                        price={obj.totalPrice}
                        name={obj.name}           
                        description={obj.description}
                        image={obj.image}
                        />
                        })
                    }
            </div>
        </div>
    )
}
export default BoughtNFT;