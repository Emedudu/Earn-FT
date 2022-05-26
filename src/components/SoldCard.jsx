import React from "react";
import Web3 from "web3";

const SoldCard=({price,
                name,
                description,
                image})=>{
    let web3=new Web3()
    return(
        <div className="p-3 col-10 col-sm-6 col-lg-4">
            <div className="card">
                <img className="card-img-top" src={image} alt="Card image cap"/>
                <div className="card-body">
                    <p className="card-title">
                        <b>Name: {name}</b>
                    </p>
                    <p className="card-text">
                        <b>Description: </b>{description}
                    </p>
                    <p className="card-text">
                        <b>Price: {web3.utils.fromWei(price.toString())} ETH</b>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default SoldCard;