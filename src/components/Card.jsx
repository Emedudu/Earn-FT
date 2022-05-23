import React from "react";
import Web3 from "web3";

const Card=({marketId,name,creator,description,price,image,contracts,account})=>{
    let web3=new Web3()
    const buyNFT=()=>{
        contracts.methods.buyNFT(marketId).send({from:account,value:price})
    }
    return(
        <div className="card col-8 col-sm-6 col-lg-4">
            <img className="card-img-top" src={image} alt="Card image cap"/>
            <div className="card-body">
                <p className="card-title font-weight-bold">
                    Name: {name}
                </p>
                <p className="card-text font-weight-bold">
                    Creator:{creator}
                </p>
                <p className="card-text font-weight-normal">
                    Description:{description}
                </p>
                <p className="card-text font-weight-light">
                    Id: {marketId}
                </p>
                <p className="card-text font-weight-light">
                    Price: {web3.utils.fromWei(price.toString())}
                </p>
                <button onClick={buyNFT}>BUY</button>
            </div>
        </div>
    )
}
export default Card;