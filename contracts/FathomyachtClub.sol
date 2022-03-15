// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./IAggregatorV3.sol";

contract FathomyachtClub is ERC721URIStorage, ERC2981, Ownable {
  uint256 private MAX_TOKEN = 10000;
  uint256[] private _tokenIds = [8000, 0, 2000, 4000, 6000];

  // mapping for token to tier number(0: power, 1: yacht, 2: prestige)
  mapping(uint256 => uint8) private _tokenToTier;

  // NFT prices in USD, mapping for tier to price(0: power, 1: yacht, 2: prestige)
  uint256[] private NFT_PRICE = [50, 100, 150, 0, 0];
  uint256[] private PRESALE_TIER_MINT_LIMIT = [100, 100, 50, 0, 0];
  uint256[] private PUBLIC_SALE_TIER_MINT_LIMIT = [900, 900, 950, 0, 0];
  string private _tokenBatchURI = "https://gateway.pinata.cloud/ipfs/QmSSGFwHzneUFom4taWhMv1MNYNrGUFFQB3VU8rgWZrFNX";
  // 0: presale start block, 1: public sale start block
  uint256[] private EVENT_BLOCK = [10264904, 10437473];
  // Mapping from address to minted number of NFTs(0: power, 1: yacht, 2: prestige)
  mapping(uint8 => uint256) private _preSaleMintCounter;
  // Mapping from address to minted number of NFTs(0: power, 1: yacht, 2: prestige)
  mapping(uint8 => uint256) private _publicSaleMintCounter;
  // Mapping from address to white list flag(1: added, 0: removed)
  mapping(address => uint8) private _whitelister;
  // Mapping that returns tokens array of a holder
  mapping(address => uint256[]) private _tokensOfholder;

  AggregatorV3Interface internal priceFeed;

  constructor() ERC721("Fathom Yacht Club", "FYC") {
    _setDefaultRoyalty(msg.sender, 1000);
    priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
  }

  modifier ableMintBatch(uint256 number, uint8 tierNumber) {
    require(NFT_PRICE[tierNumber] != 0, "Tier price is not set.");
    require(number <= 2, "You are not allowed to buy more than 2 tokens at once.");
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");
    require(MAX_TOKEN > number + totalSupply() + 1, "Not enough tokens left to buy.");

    uint8 blockStatus = checkBlock(msg.sender);
    // uint8 blockStatus = 1;
    require(blockStatus > 0, "Not available to mint.");
    _;
  }

  function checkBlock(address pm_address) internal view returns(uint8) {
    uint256 curBlock = block.number;

    if (curBlock >= EVENT_BLOCK[1]) {
      return 2;
    }
    if (curBlock >= EVENT_BLOCK[0]) {
      if(_whitelister[pm_address]== 1) {
        return 1;
      }
    }

    return 0;
  }

  function addWhiteList(address[] memory lsts) public onlyOwner {
    uint256 new_len = lsts.length;
    for(uint256 i=0; i<new_len; i++) {
      _whitelister[lsts[i]] = 1;
    }
  }

  function getTokensOfHolder(address holder_address) external view returns(uint256[] memory) {
    return _tokensOfholder[holder_address];
  }

  function removeWhiteList(address[] memory lsts) public onlyOwner {
    uint256 new_len = lsts.length;
    for(uint256 i=0; i<new_len; i++) {
      _whitelister[lsts[i]] = 0;
    }
  }

  function getTierNumberOf(uint256 _tokenId) public view returns(uint8) {
    return _tokenToTier[_tokenId];
  }

  function getTierPrice(uint8 tierNumber) public view returns(uint256) {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array");
    return NFT_PRICE[tierNumber];
  }

  function setTierPrice(uint256 price, uint8 tierNumber) external onlyOwner {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");
    NFT_PRICE[tierNumber] = price;
  }

  function getMaxLimit() external view returns(uint256) {
    return MAX_TOKEN;
  }

  function setMaxLimit(uint256 limit) external onlyOwner {
    MAX_TOKEN = limit;
  }

  function getTierLimit(uint8 tierNumber) external view returns(uint256) {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");

    uint256 curBlock = block.number;
    if (curBlock >= EVENT_BLOCK[1]) {
      return PUBLIC_SALE_TIER_MINT_LIMIT[tierNumber];
    }
    if (curBlock >= EVENT_BLOCK[0]) {
      return PRESALE_TIER_MINT_LIMIT[tierNumber];
    }

    return 0;
  }

  function setTierMintLimit(uint256 limit, uint8 tierNumber) external onlyOwner {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");

    uint256 curBlock = block.number;
    if (curBlock >= EVENT_BLOCK[1]) {
      PUBLIC_SALE_TIER_MINT_LIMIT[tierNumber] = limit;
    }
    if (curBlock >= EVENT_BLOCK[0]) {
      PRESALE_TIER_MINT_LIMIT[tierNumber] = limit;
    }
  }

  function withDraw() external onlyOwner {
    address payable tgt = payable(owner());
    (bool success1, ) = tgt.call{value:address(this).balance}("");
    require(success1, "Failed to Withdraw Ether");
  }

  function getTokenURI(uint256 _tokenId) public view returns(string memory) {
    string memory subDirectory = 'Not specified';
    if (_tokenId > 0 && _tokenId <= 2000) {
      subDirectory = '/Yacht/';
    }
    else if (_tokenId > 2000 && _tokenId <= 4000) {
      subDirectory = '/Prestige/';
    }
    else if (_tokenId > 4000 && _tokenId <= 6000) {
      subDirectory = '/Ultra/';
    }
    else if (_tokenId > 6000 && _tokenId <= 8000) {
      subDirectory = '/Reserve/';
    }
    else if (_tokenId > 8000 && _tokenId <= 10000) {
      subDirectory = '/Power/';
    }

    return string(abi.encodePacked(_tokenBatchURI, subDirectory, uint2str(_tokenId)));
  }

  function setTokenBatchURI(string memory _batchTokenURI) external onlyOwner {
    _tokenBatchURI = _batchTokenURI;
  }

  function setTokenURI(uint256 number, string memory tokenURI) public onlyOwner {
    _setTokenURI(number, tokenURI);
  }

  function mintBatch(uint256 number, uint8 tierNumber) public payable ableMintBatch(number, tierNumber) returns(uint256) {
    require(msg.value >= ((NFT_PRICE[tierNumber] * number) * (10 ** 26)) / uint256(getLatestPrice()), "Amount of ether sent not correct.");

    // refund the remainder
    address payable tgt = payable(msg.sender);
    (bool success1, ) = tgt.call{ value: msg.value - (((NFT_PRICE[tierNumber] * number) * (10 ** 26)) / uint256(getLatestPrice())) }("");
    require(success1, "Failed to refund");

    uint256[] storage tierMintLimit = PRESALE_TIER_MINT_LIMIT;
    mapping(uint8 => uint256) storage tierMintCounter = _preSaleMintCounter;
    uint256 curBlock = block.number;

    // use public sale variables if the current date is after public sale started
    if (curBlock >= EVENT_BLOCK[1]) {
      tierMintLimit = PUBLIC_SALE_TIER_MINT_LIMIT;
      tierMintCounter = _publicSaleMintCounter;
    }
    require(tierMintCounter[tierNumber] + number < tierMintLimit[tierNumber], "Overflow maximum mint limitation.");

    uint256 newItemId = 0;
    // set where start the tokenIds to be incremented

    for (uint256 i = 0; i < number; i++) {
      _tokenIds[tierNumber]++;
      newItemId = _tokenIds[tierNumber];
      _mint(msg.sender, newItemId);
      _tokenToTier[newItemId] = tierNumber;
      _tokensOfholder[msg.sender].push(newItemId);
      _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    tierMintCounter[tierNumber] = tierMintCounter[tierNumber] + number;

    return newItemId;
  }

  function totalSupply() public view returns(uint256) {
    uint256 total = 0;
    for(uint8 i = 0; i < 5; i++) {
      total += (_preSaleMintCounter[i] + _publicSaleMintCounter[i]);
    }
    
    return total;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
    * @dev See {ERC721-_burn}. This override additionally clears the royalty information for the token.
    */
  function _burn(uint256 tokenId) internal virtual override {
    super._burn(tokenId);
    _resetTokenRoyalty(tokenId);
  }

  function setRoality(address receiver, uint96 feeNumerator) external onlyOwner {
    _setDefaultRoyalty(receiver, feeNumerator);
  }

  function getLatestPrice() public view returns (int) {
    (
      ,
      int price,
      ,
      ,
      
    ) = priceFeed.latestRoundData();
    return price;
  }

  // use this for test purpose and delete when deploy on the mainnet
  function getLocalPrice() public pure returns (int) {
    int price = 257508605065;
    return price;
  }

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
    string memory prefix = '';
    if (_i == 0) {
      return "0";
    }
    else if (_i > 0 && _i < 10) {
      prefix = '0000';
    }
    else if (_i >= 10 && _i < 100) {
      prefix = '000';
    }
    else if (_i >= 100 && _i < 1000) {
      prefix = '00';
    }
    else if (_i >= 1000 && _i < 10000) {
      prefix = '0';
    }

    uint j = _i;
    uint len;
    while (j != 0) {
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint k = len;
    while (_i != 0) {
      k = k-1;
      uint8 temp = (48 + uint8(_i - _i / 10 * 10));
      bytes1 b1 = bytes1(temp);
      bstr[k] = b1;
      _i /= 10;
    }

    return string(abi.encodePacked(prefix, string(bstr)));
  }
}
