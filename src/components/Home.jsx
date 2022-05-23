import React, { useEffect, useState } from 'react';
import Card from './Card';

const Home=({contracts,Token,account})=>{
    const [allItems,setAllItems]=useState([])

    const getAllItems=async()=>{
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
                    image:metadata.imageUri
                })
            }
        }
        setAllItems(itemsFetched)
    }
    useEffect(()=>{
        contracts&&getAllItems()
    },[contracts,Token])
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
                        contract={contracts}
                        account={account}/>
                        })
                    }
            </div>
        </div>
    )
}
export default Home;