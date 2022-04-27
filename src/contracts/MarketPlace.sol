pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Token.sol";

contract MarketPlace{
    Item[] itemsForSale;
    address payable feeBank;
    uint percentage;

    struct Item{
        IERC721 item;
        uint id;
        address creator;
        uint price;
    }
    
    constructor(address payable feeAddress,uint feePercent){
        feeBank=feeAddress;
        percentage=feePercent;
    }
    
    function uploadNFT(IERC721 nft,uint itemId,uint price) public{
        require(price>=0,"Enter a valid price");
        nft.transferFrom(msg.sender,address(this),itemId);
        itemsForSale.push(Item({
            item:nft,
            id:itemId,
            creator:msg.sender,
            price:price
        }));

    }
}