import React from "react";

const Card=({marketId,name,creator,description,price,image})=>{

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
                    Price: {price}
                </p>
            </div>
        </div>
    )
}
export default Card;