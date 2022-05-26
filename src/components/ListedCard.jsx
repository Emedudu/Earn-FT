import React from "react";
import Web3 from "web3";

const ListedCard=({marketId,
                creator,
                price,
                name,
                description,
                image,
                removeNFT})=>{
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
                    <p className="card-text">
                        <b>Creator: </b><i className='font-weight-light'>{creator}</i>
                    </p>
                    <button type='button' 
                            className={`btn btn-primary align-self-center`} 
                            onClick={()=>{
                                removeNFT(marketId)
                                }}>REMOVE
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ListedCard;