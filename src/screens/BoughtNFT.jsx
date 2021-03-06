import React, { useEffect} from 'react';
import BoughtCard from '../components/BoughtCard';

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
            fromBlock:10758069,
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
                getBoughtNFTs()
                setBoughtInitialRender(false);
            } 
        }
    },[contracts])
    contracts&&marketChanged&&getBoughtNFTs()
    return(
        <div>
            {purchases.length?(
                <div className='d-flex row justify-content-center'>
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
            ):(
                <div className='d-flex align-items-center justify-content-center' style={{'height':'100vh'}}>
                    <h4>No items purchased</h4>
                </div>
            )
            }
        </div>
    )
}
export default BoughtNFT;