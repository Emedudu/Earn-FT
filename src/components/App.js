import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, Route, Routes } from 'react-router-dom';
import Web3 from 'web3';
import MarketPlace from '../abis/MarketPlace'
import NFTToken from '../abis/NFTToken'
import './App.css';
import BoughtNFT from './BoughtNFT';
import Home from './Home';
import MyListedNFTs from './MyListedNFTs';
import Navigation from './Navbar';
import UploadNFT from './UploadNFT';
// import {createAlchemyWeb3} from "@alch/alchemy-web3";

const App=()=> {
  const [contracts,setContracts]=useState('')
  const [token,setToken]=useState('')
  const [accounts,setAccounts]=useState('')
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [purchases,setPurchases]=useState([])
  const [allItems,setAllItems]=useState([])
  const [listedItems,setListedItems]=useState([])
  const [soldItems,setSoldItems]=useState([])
  const [marketChanged,setMarketChanged]=useState(false)
  const [homeInitialRender,setHomeInitialRender]=useState(true)
  const [listedInitialRender,setListedInitialRender]=useState(true)
  const [boughtInitialRender,setBoughtInitialRender]=useState(true)

  const loadBlockChainData=async()=>{
    setLoading(true)
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
        window.localStorage.setItem('connect', true);
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
        // console.log(err)
        window.alert("Unable to load Contracts")
      }
    }else{
      window.alert('Please Install Metamask')
    }
    setLoading(false)
  }
  useEffect(()=>{
    let connect=window.localStorage.getItem('connect');
    if (connect){
      loadBlockChainData()
    }
  },[])
  return (
    <div className={`container-fluid m-0 p-0 full-width d-flex flex-column ${loading&&'overflow-hidden'}`}>
      <Navigation walletConnect={loadBlockChainData} account={accounts[0]}/>
      <div className='container-fluid'>
        <div className={`container d-flex position-fixed justify-content-between p-3 mb-2 bg-info text-white ${message!==''?'visible':'invisible'}`} style={{'zIndex':'999','width':'100%'}}>
          {message}
          <button type="button" className="close" aria-label="Close" onClick={()=>setMessage('')}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className={`d-flex full-height full-width justify-content-center align-items-center position-absolute ${loading?'visible':'invisible'}`} style={{'backgroundColor':'rgba(255,255,255,0.5)','zIndex':'999'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <Routes>
          <Route exact path="/" element={<Home 
                                          contracts={contracts} 
                                          account={accounts[1]} 
                                          Token={token} 
                                          setMessage={setMessage} 
                                          setLoading={setLoading} 
                                          homeInitialRender={homeInitialRender}
                                          setHomeInitialRender={setHomeInitialRender}
                                          allItems={allItems}
                                          setAllItems={setAllItems}
                                          marketChanged={marketChanged} 
                                          setMarketChanged={setMarketChanged}/>}/>
          <Route exact path="/uploadNFT" element={<UploadNFT 
                                          contracts={contracts} 
                                          account={accounts[1]} 
                                          Token={token}
                                          setMessage={setMessage} 
                                          setLoading={setLoading} 
                                          setMarketChanged={setMarketChanged}/>}/>
          <Route exact path="/boughtNFT" element={<BoughtNFT 
                                          contracts={contracts} 
                                          account={accounts[1]} 
                                          Token={token}
                                          purchases={purchases}
                                          setPurchases={setPurchases}
                                          marketChanged={marketChanged}                                         
                                          boughtInitialRender={boughtInitialRender}
                                          setBoughtInitialRender={setBoughtInitialRender} 
                                          setLoading={setLoading}/>}/>
          <Route exact path="/myListedNFT" element={<MyListedNFTs 
                                          contracts={contracts} 
                                          account={accounts[1]} 
                                          Token={token}  
                                          setLoading={setLoading} 
                                          listedInitialRender={listedInitialRender}
                                          setListedInitialRender={setListedInitialRender}
                                          listedItems={listedItems}
                                          setListedItems={setListedItems}
                                          soldItems={soldItems}
                                          setSoldItems={setSoldItems}
                                          marketChanged={marketChanged} 
                                          setMarketChanged={setMarketChanged}/>}/>
        </Routes>
        
      </div>
    </div>  
  );
  
}

export default App;
