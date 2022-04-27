pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
contract NFTToken is ERC721URIStorage{
    uint public tokenId;

    constructor() ERC721('NFTToken','NFT'){}
    
    function mint(string memory tokenURI) public returns(uint){
        tokenId++ ;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return(tokenId);
    }
}