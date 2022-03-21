// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FathomyachtClub is ERC721URIStorage, ERC2981, Ownable, ReentrancyGuard, AccessControlEnumerable {
	  // Protect uint using safemath
  using SafeMath for uint256;  

  uint256 public MAX_TOKEN = 10000;
  uint256[] private _tokenIds = [8000, 0, 2000, 4000, 6000];
  uint256[] private _tokens;
  // Mapping that returns tokens array of a holder
  mapping(address => uint256[]) private _tokensOfholder;

	// Log more in depth events such as withdrawals and cancelled txns
  event LogWithdrawal(address indexed withdrawer, address indexed withdrawalAccount, uint amount);
  event LogCanceled();

  // mapping for token to tier number(0: power, 1: yacht, 2: prestige)
  mapping(uint256 => uint8) public _tokenToTier;

  // NFT prices in USD, mapping for tier to price(0: power, 1: yacht, 2: prestige)
  uint256[] private NFT_PRICE = [50, 100, 150, 9999, 9999];
  uint256[] private PRESALE_TIER_MINT_LIMIT = [100, 100, 50, 0, 0];
  uint256[] private PUBLIC_SALE_TIER_MINT_LIMIT = [900, 900, 950, 0, 0];
  // 0: presale start block, 1: public sale start block
  uint256[] private EVENT_BLOCK = [10264904, 10437473];
  // Mapping from address to minted number of NFTs(0: power, 1: yacht, 2: prestige)
  mapping(uint8 => uint256) private _preSaleMintCounter;
  // Mapping from address to minted number of NFTs(0: power, 1: yacht, 2: prestige)
  mapping(uint8 => uint256) private _publicSaleMintCounter;
  // Mapping from address to white list flag(1: added, 0: removed)
  mapping(address => uint8) private _whitelister;

  AggregatorV3Interface internal priceFeed;

  constructor() ERC721("Fathom Yacht Club", "FYC") {
    _setDefaultRoyalty(msg.sender, 1000);
    priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
  }

  modifier ableMintBatch(uint256 number, uint8 tierNumber) {
    require(NFT_PRICE[tierNumber] != 0, "Tier price is not set.");
    require(number <= 2, "You are not allowed to buy more than 2 tokens at once.");
    require(tierNumber >= 0 && tierNumber <= 4, "Invalied tierNumber of array.");
    require(MAX_TOKEN > number + totalSupply() + 1, "Not enough tokens left to buy.");

    uint8 blockStatus = checkBlock(msg.sender);
    // uint8 blockStatus = 1;
    require(blockStatus > 0, "Not available to mint.");
    _;
  }

  modifier ableGetOrSetMintLimit(uint8 _saleNumber, uint8 _tierNumber) {
    require(_saleNumber >= 1 && _saleNumber <= 2, "saleNumber must be larger than 0. 1: Presale, 2: Public sale");
    require(_tierNumber >= 0 && _tierNumber <= 4, "Invalied tierNumber of array.");
    _;
  }

  function checkBlock(address pm_address) internal view returns(uint8) {
    if (block.number >= EVENT_BLOCK[1]) return 2;
    if (block.number >= EVENT_BLOCK[0]) {
      if(_whitelister[pm_address]== 1) return 1;
    }

    return 0;
  }

  function addWhiteList(address[] memory lsts) public onlyOwner {
    uint256 new_len = lsts.length;
    for(uint256 i=0; i<new_len; i++) {
      _whitelister[lsts[i]] = 1;
    }
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
    require(tierNumber >= 0 && tierNumber <= 4, "Invalied tierNumber of array");
    return (NFT_PRICE[tierNumber] * (10 ** 26)) / uint256(getLatestPrice());
  }

  function setTierPrice(uint256 price, uint8 tierNumber) external onlyOwner {
    require(tierNumber >= 0 && tierNumber <= 4, "Invalied tierNumber of array.");
    NFT_PRICE[tierNumber] = price;
  }

  function setMaxLimit(uint256 limit) external onlyOwner {
    MAX_TOKEN = limit;
  }

  /**
    * @dev Set tier mint limit per sale season
    *
    * @param _saleNumber 1: Presale, 2: Public Sale
    * @param _tierNumber 0: Power, 1: Yacht, 2: Prestige, 3: Ultra, 4: Reserve
    */
  function getTierMintLimit(uint8 _saleNumber, uint8 _tierNumber) external view ableGetOrSetMintLimit(_saleNumber, _tierNumber) returns(uint256) {
    if (_saleNumber == 1) return PRESALE_TIER_MINT_LIMIT[_tierNumber];
    else return PUBLIC_SALE_TIER_MINT_LIMIT[_tierNumber];
  }

  /**
    * @dev Set tier mint limit per sale season
    *
    * @param _saleNumber 1: Presale, 2: Public Sale
    * @param _limit target address that will receive the tokens
    * @param _tierNumber 0: Power, 1: Yacht, 2: Prestige, 3: Ultra, 4: Reserve
    */
  function setTierMintLimit(uint8 _saleNumber, uint256 _limit, uint8 _tierNumber) external onlyOwner ableGetOrSetMintLimit(_saleNumber, _tierNumber) {
    if (_saleNumber == 1) PRESALE_TIER_MINT_LIMIT[_tierNumber] = _limit;
    else PUBLIC_SALE_TIER_MINT_LIMIT[_tierNumber] = _limit;
  }

  /**
    * @dev Set tier mint limit per sale season
    *
    * @param _saleNumber 1: Presale, 2: Public Sale
    * @param _blockNumber Block number of sale season
    */
  function setSaleEvent(uint8 _saleNumber, uint256 _blockNumber) external onlyOwner {
    require(_saleNumber >= 1 && _saleNumber <= 2, "saleNumber must be larger than 0. 1: Presale, 2: Public sale");
    EVENT_BLOCK[_saleNumber - 1] = _blockNumber;
  }

  function withDraw() nonReentrant external onlyOwner {
    address payable tgt = payable(owner());
    (bool success1, ) = tgt.call{value:address(this).balance}("");
    require(success1, "Failed to Withdraw Ether");
  }

  function _coreMintBatch(address _to, uint8 tierNumber, uint256 number) internal returns (uint256) {
    uint256[] storage tierMintLimit = PRESALE_TIER_MINT_LIMIT;
    mapping(uint8 => uint256) storage tierMintCounter = _preSaleMintCounter;
    // use public sale variables if the current date is after public sale started
    if (block.number >= EVENT_BLOCK[1]) {
      tierMintLimit = PUBLIC_SALE_TIER_MINT_LIMIT;
      tierMintCounter = _publicSaleMintCounter;
    }
    require(tierMintCounter[tierNumber] < tierMintLimit[tierNumber], "Overflow maximum mint limitation.");

    uint256 newItemId = 0;

    for (uint256 i = 0; i < number; i++) {
      _tokenIds[tierNumber]++;
      newItemId = _tokenIds[tierNumber];
      _mint(_to, newItemId);
      _tokenToTier[newItemId] = tierNumber;
      _tokensOfholder[_to].push(newItemId);
      _tokens.push(newItemId);
    }

    tierMintCounter[tierNumber] = tierMintCounter[tierNumber] + number;

    return newItemId;
  }

  function mintBatch(uint256 number, uint8 tierNumber) public nonReentrant  payable ableMintBatch(number, tierNumber) returns(uint256) {
    require(msg.value >= getTierPrice(tierNumber) * number, "Amount of ether sent not correct.");

    // refund the remainder
    address payable tgt = payable(msg.sender);
    (bool success1, ) = tgt.call{ value: msg.value - getTierPrice(tierNumber) * number }("");
    require(success1, "Failed to refund");

	  // reject payments of 0 ETH
    if (msg.value == 0) revert();

    uint256 newItemId = _coreMintBatch(msg.sender, tierNumber, number);

    return newItemId;
  }

  function mintTo(address to) external payable {
    uint8 tierNumber = getTierNumberByPrice(msg.value);
    require(tierNumber >= 0 && tierNumber <= 4, "Amount of ether sent is not enough.");
    require(MAX_TOKEN > totalSupply() + 1, "Not enough tokens left to buy.");

    _coreMintBatch(to, tierNumber, 1);
  }

  function getTierNumberByPrice(uint256 _price) public view returns (uint8) {
    uint8 tierNumber = 255;

    for(uint8 i = 0; i < NFT_PRICE.length; i++) {
      uint256 nftPrice = (NFT_PRICE[i] * (10 ** 26)) / uint256(getLatestPrice());
      if (_price >= nftPrice) tierNumber = i;
    }

    return tierNumber;
  }

  function getTokens() external view returns(uint256[] memory) {
    return _tokens;
  }

  function getTokensOfHolder(address _address) external view returns(uint256[] memory) {
    return _tokensOfholder[_address];
  }

  function totalSupply() public view returns(uint256) {
    uint256 total = 0;
    for(uint8 i = 0; i < 5; i++) {
      total += (_preSaleMintCounter[i] + _publicSaleMintCounter[i]);
    }
    
    return total;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981, AccessControlEnumerable) returns (bool) {
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

  function transferFrom(
      address from,
      address to,
      uint256 tokenId
  ) public override {
      //solhint-disable-next-line max-line-length
      require(_isApprovedOrOwner(_msgSender(), tokenId), "FYC: transfer caller is not owner nor approved");

      for(uint256 i = 0; i < _tokensOfholder[from].length; i++) {
        if (_tokensOfholder[from][i] == tokenId) {
          _tokensOfholder[to].push(_tokensOfholder[from][i]);
          _tokensOfholder[from][i] = _tokensOfholder[from][_tokensOfholder[from].length - 1];
          _tokensOfholder[from].pop();
        }
      }

      _transfer(from, to, tokenId);
  }

  function getLatestPrice() public view returns (int) {
    (,int price,,,) = priceFeed.latestRoundData();
    return price;
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://fyc.mypinata.cloud/ipfs/QmbhXRfyS53JKMpRQBSgs4s4jpTZGLhWPVcrtkYqHvKXQE/";
  }
}
