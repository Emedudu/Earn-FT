import React from 'react';

const UploadNFT=({contracts,account})=>{
    const submitFile=(e)=>{
        e.preventDefault();
        console.log(e.target.value)
    }
    return(
        <div>
            Upload NFTs
            <input 
            onInput={submitFile}
            type='file'
            className="form-control"/>
        </div>
    )
}
export default UploadNFT;