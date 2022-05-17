import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Web3 from 'web3';
import MarketPlace from '../abis/MarketPlace.json';
import NFTToken from '../abis/NFTToken.json';
import './App.css';
import BoughtNFT from './BoughtNFT';
import Home from './Home';
import UploadNFT from './UploadNFT';
// import {createAlchemyWeb3} from "@alch/alchemy-web3";

const App=()=> {
  const [contracts,setContracts]=useState('')
  const [token,setToken]=useState('')
  const [accounts,setAccounts]=useState('')
  const loadBlockChainData=async()=>{
    if(typeof window.ethereum!=='undefined'){
      const web3 = await new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'))
      // const url = `wss://rinkeby.infura.io/ws/v3/5a5069b4ad6f4c38afe55f29fe40b91e`;
// Using WebSockets
      // const web3 = createAlchemyWeb3(url);
      // Using web3js
      // const web3 = new Web3(new Web3.providers.WebsocketProvider(url));
      await window.ethereum.enable();
      const netId=await web3.eth.net.getId();
      const accounts=await web3.eth.getAccounts();
      console.log(accounts)
      if(typeof accounts[0] !=='undefined'){
        setAccounts(accounts);
        // console.log(accounts);
        // console.log(netId);
      }else{
        window.alert('Please login with metamask')
      }
      try{
        let contract=await new web3.eth.Contract(MarketPlace.abi,MarketPlace.networks[netId].address);
        let token=await new web3.eth.Contract(NFTToken.abi,NFTToken.networks[netId].address);
        setContracts(contract)
        setToken(token)
      }catch(err){
        window.alert("Unable to load Contracts")
      }
    }else{
      window.alert('Please Install Metamask')
    }
  }
  useEffect(()=>{
    loadBlockChainData()
  },[])
  return (
    <div className='container row full-height d-flex flex-column'>
      <nav className='navbar row '>
        <Link to="/" type="button" className={`btn col-4 font-weight-bold`}>HOME</Link>
        <Link to="/uploadNFT" type="button" className={`btn col-4 font-weight-bold`}>UPLOADED NFTs</Link>
        <Link to="/boughtNFT" type="button" className={`btn col-4 font-weight-bold`}>BOUGHT NFTs</Link>
      </nav>
      <Routes>
        <Route exact path="/" element={<Home contracts={contracts} account={accounts[0]}/>}/>
        <Route exact path="/uploadNFT" element={<UploadNFT contracts={contracts} account={accounts[0]}/>}/>
        <Route exact path="/boughtNFT" element={<BoughtNFT contracts={contracts} account={accounts[0]}/>}/>
      </Routes>
    </div>    
  );
  
}

export default App;
