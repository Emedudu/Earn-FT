import React, { useState } from 'react';
import Web3 from 'web3';
import {create as ipfsHttpClient} from 'ipfs-http-client'

const client=ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const UploadNFT=({contracts,
                account,
                Token,
                setMessage,
                setLoading,
                setMarketChanged})=>{
    const web3=new Web3()
    const [imageUri, setImageUri]=useState('')
    const [description, setDescription]=useState('')
    const [price,setPrice]=useState(0)
    const [nam,setName]=useState('')
    const submitFile=async(e)=>{
        e.preventDefault();
        setLoading(true)
        if(imageUri&&description&&price&&nam){
            try{
                let res=await client.add(JSON.stringify({nam,description,imageUri}))
                mint(res)
            }catch(err){
                console.log('Could not upload uri to ipfs')
            }

        }
        setLoading(false)
        setMarketChanged(true)
    }
    const mint=async(res)=>{
        let uri=`https://ipfs.infura.io/ipfs/${res.path}`
        Token&&Token.methods.mint(uri).send({from:account, gas:5000000})
        let tokenId=await await(Token&&Token.methods.tokenId().call())       
        Token&&Token.methods.setApprovalForAll(contracts._address,true).send({from:account, gas:5000000}).then(()=>console.log('done'))
        contracts&&contracts.methods.uploadNFT(Token._address,parseInt(tokenId.toString())+1,web3.utils.toWei(price)).send({from:account, gas:5000000})      
    }
    const uploadToIPFS=async(e)=>{
        e.preventDefault();
        setLoading(true)
        let file=e.target.files[0]
        if (file!=='undefined'){
            try {
                let res=await client.add(file)
                setImageUri(`https://ipfs.infura.io/ipfs/${res.path}`)
            } catch (error) {
                console.log('Could not upload to Ipfs')
            }
        }
        setLoading(false)
    }
    contracts&&contracts.events.Uploaded({
        filter:{adress:account}
    })
        .on('data',event=>{console.log(event.returnValues);setMessage(`You just uploaded ${nam} for a price of ${web3.utils.fromWei(event.returnValues.price.toString())} ETH`)})
    return( 
        <div style={{'height':'100vh'}}>
            <div className='container w-60 d-flex flex-column justify-content-around align-items-center' style={{'height':'500px'}}>
                <input 
                onChange={(e)=>uploadToIPFS(e)}
                type='file'
                placeholder='Choose Image'
                className="form-control"
                accept="audio/*,video/*,image/*"
                />
                <input
                onChange={(e)=>setName(e.target.value)}
                placeholder='Enter name of NFT'
                className='form-control'
                />
                <textarea
                onBlur={(e)=>setDescription(e.target.value)}
                rows='4'
                placeholder='Enter description of NFT'
                className='form-control'
                />
                <input
                onChange={(e)=>setPrice(e.target.value)}
                type='number'
                step='0.01'
                placeholder='Enter price of NFT in ETH'
                className='form-control'
                />
                <button onClick={submitFile} type='button' className='btn btn-primary'>UPLOAD</button>
            </div>
        </div>      
    )
}
export default UploadNFT;