import React, { useEffect, useState } from 'react';
import Card from './Card';

const Home=({contracts,account})=>{
    const [allItems,setAllItems]=useState([])

    const getAllItems=async()=>{
        let res=contracts && await contracts.methods.itemsCount().call()
        let count =parseInt(res)
        console.log(count)
        for (let i=1;i<=count;i++){
            let item=await contracts.methods.itemsForSale(i).call();
            if (!item.sold){
                setAllItems([...allItems,{
                    marketId:i,
                    creator:item.creator,
                    name:item.name,
                    price:item.price,
                    image:item.img
                }])
            }
        }
    }
    useEffect(()=>{
        contracts&&getAllItems()
    },[])
    return(
        <div>
            Home
            {allItems.map((obj,i)=>{
                    return <Card
                    key={i} 
                    marketId={obj.marketId}
                    name={obj.name}
                    creator={obj.creator}
                    price={obj.price}
                    image={obj.image}/>
                    })
                    }
        </div>
    )
}
export default Home;