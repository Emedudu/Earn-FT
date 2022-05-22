import React, { useState } from 'react';
import Web3 from 'web3';
import {create as ipfsHttpClient} from 'ipfs-http-client'
const client=ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const UploadNFT=({contracts,account,Token,loading,setLoading})=>{
    const [imageUri, setImageUri]=useState('')
    const [description, setDescription]=useState('')
    const [price,setPrice]=useState(0)
    const [nam,setName]=useState('')
    const submitFile=async(e)=>{
        e.preventDefault();
        if(imageUri&&description&&price&&nam){
            try{
                let res=await client.add(JSON.stringify({nam,description,imageUri}))
                mint(res)
            }catch(err){
                console.log('Could not upload uri to ipfs')
            }

        }
        // let itmId=Token&&Token.mint(uri)
        // contracts&&contracts.methods.uploadNFT(Token.address,NFTId,price,nam,file).send({from:account})
    }
    const mint=async(res)=>{
        let uri=`https://ipfs.infura.io/ipfs/${res.path}`
        await Token&&Token.methods.mint(uri).send({from:account, gas:5000000})
        let tokenId=await await(Token&&Token.methods.tokenId().call())
        Token&&Token.methods.setApprovalForAll(contracts.address,true).send({from:account, gas:5000000}).then(()=>console.log('done'))
        contracts&&contracts.methods.uploadNFT(Token.address,parseInt(tokenId.toString()),price).send({from:account, gas:5000000})
        console.log(parseInt(tokenId.toString()))
    }
    
       // contracts&&contracts.methods.uploadNFT(Token.address,tokenId,price).send({from:accoun}
    const uploadToIPFS=async(e)=>{
        e.preventDefault();
        let file=e.target.files[0]
        if (file!=='undefined'){
            try {
                let res=await client.add(file)
                setImageUri(`https://ipfs.infura.io/ipfs/${res.path}`)
            } catch (error) {
                console.log('Could not upload to Ipfs')
            }
        }
    }
    return(
        
        <div className='container w-60 d-flex flex-column justify-content-between align-items-center' style={{'height':'400px'}}>
            <input 
            onChange={(e)=>uploadToIPFS(e).then(()=>setLoading(false))}
            type='file'
            placeholder='Choose Image'
            className="form-control"
            accept="image/png, image/jpeg"/>
            <textarea
            onBlur={(e)=>setDescription(e.target.value)}
            rows='3'
            placeholder='Enter description of NFT'
            className='form-control'
            />
            <input
            onChange={(e)=>setPrice(e.target.value)}
            type='number'
            step='0.01'
            placeholder='Enter price of NFT'
            className='form-control'
            />
            <input
            onChange={(e)=>setName(e.target.value)}
            placeholder='Enter Creator name'
            className='form-control'
            />
            <button onClick={submitFile}>UPLOAD</button>
        </div>

    )
}
export default UploadNFT;