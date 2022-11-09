// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.3/utils/Counters.sol";

contract TESTPRJ is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string[] private uriList = [
        "https://ipfs.io/ipfs/QmeCfkuTG5TQdVLfdVFpARGfFksRHPJ1CxNLQhxpYWFrFM/",
        "https://ipfs.io/ipfs/QmZcjSrVmELzC8ShQgHzzXCXKrMRVCkHKRv4a4ZCZoN34o/",
        "https://ipfs.io/ipfs/QmPyrRkLxziMZ3A8Ki16JpJN4v3ZuNoJHrffXaBzJVThBa/"
    ];

    uint256 private uriId = 0;

    address c_owner;

    constructor() ERC721("TEST PRJ", "TPJ") {
        c_owner = msg.sender;
    }

    function _baseURI() internal view override returns (string memory) {
        return uriList[uriId];
    }

    function safeMint() public {
        uint256 tokenId = _tokenIdCounter.current();
        uint256 nbItems = 100;
        
        if((tokenId % nbItems == 0) && (tokenId > 0)){
            uriId = tokenId / nbItems;
        }

        _tokenIdCounter.increment();

        if(tokenId <= 300){

            _safeMint(msg.sender, tokenId + 1);
        }
        
    }

    function ownerMint() public {
        require(msg.sender == c_owner, "Vous n'avez pas le droit de minter!");
        safeMint();
    }
}