pragma solidity ^0.8.0;
// import dependencies
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Token.sol";

contract MarketPlace{
    // an array of nfts for sale on the marketplace
    Item[] itemsForSale;
    // variables modified by deployer
    address payable feeBank;
    uint percentage;
    // description of an nft item on the marketplace
    struct Item{
        IERC721 item;
        uint id;
        address creator;
        uint price;
    }
    // event emitted when seller uploads nft to marketplace
    event Uploaded(address market,uint price,uint itemId);
    // deployer gives the fees address and the percentage of fee per item
    constructor(address payable feeAddress,uint feePercent){
        feeBank=feeAddress;
        percentage=feePercent;
    }
    // seller uploads nft to marketplace (accepts as arguments NFT instance,tokenId, and price)
    function uploadNFT(IERC721 nft,uint itemId,uint price) public{
        // price of an item cannot be negative
        require(price>=0,"Enter a valid price");
        // transfer ownership to the marketplace needs the approve function called
        nft.transferFrom(msg.sender,address(this),itemId);
        // appends to the array of items for sale
        itemsForSale.push(Item({
            item:nft,
            id:itemId,
            creator:msg.sender,
            price:price
        }));
        // emit the uploaded event
        emit Uploaded(address(this),price,itemId);
    }
}