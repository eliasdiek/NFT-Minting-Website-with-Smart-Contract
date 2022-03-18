// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IFYC is IERC721 {
    function totalSupply() external view returns(uint256 number);
    function getTierNumberOf(uint256 _tokenId) external view returns(uint8 tierNumber);
    function getTierPrice(uint8 tierNumber) external view returns(uint256 tierPrice);
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address roalityReceiver, uint256 royaltyAmount);
    function setRoality(address receiver, uint96 feeNumerator) external;
    function getLatestPrice() external view returns (int price);
}

contract Leasing is Ownable {
    event ApproveLeasing(uint tokenId);
    
    IERC20 _weth = IERC20(0xc778417E063141139Fce010982780140Aa0cD5Ab);
    IFYC _nft;
    uint8 private _refundPercentFee = 98;

    struct LeaseOffer {
        address from;
        uint256 price;
        uint32 expiresIn;
        uint256 createdAt;
    }

    struct LeasableToken {
        uint256 tokenId;
        uint256 price;
        uint32 duration;
    }
    
    mapping (uint256 => LeaseOffer) private _lease;
    mapping (address => uint256[]) private _addrToLeasingTokens;
    mapping(uint256 => mapping(address => bool)) _offerState;
    mapping (uint256 => LeaseOffer[]) leaseOffers;
    mapping (uint256 => bool) leasable;
    LeasableToken[] private _leasableTokens;
    
    modifier onlyOwnerOf(uint256 _tokenId) {
        require(msg.sender == address(_nft.ownerOf(_tokenId)), "caller is not the owner of token");
        _;
    }

    function getNFTAddress() external view returns(address) {
        return address(_nft);
    }

    function setNFTAddress(address nft_address) external onlyOwner {
        _nft = IFYC(nft_address);
    }

    function withDraw() external onlyOwner {
        address payable tgt = payable(owner());
        (bool success1, ) = tgt.call{value:address(this).balance}("");
        require(success1, "Failed to Withdraw VET");
    }

    function getRoalityInfo(uint256 _tokenId, uint256 _salePrice) public view returns(address, uint256) {
        (address roalityReceiver, uint256 royaltyAmount) = _nft.royaltyInfo(_tokenId, _salePrice);

        return (roalityReceiver, royaltyAmount);
    }

    /**
     * @dev The denominator with which to interpret the fee set in {_setTokenRoyalty} and {_setDefaultRoyalty} as a
     * fraction of the sale price. Defaults to 10000 so fees are expressed in basis points.
     */
    function setRoality(address receiver, uint96 feeNumerator) external onlyOwner {
        _nft.setRoality(receiver, feeNumerator);
    }

    function getRefundFee() external view returns(uint8) {
        return _refundPercentFee;
    }

    function setRefundFee(uint8 fee) external onlyOwner {
        require(fee > 0 && fee <100, "Invalied percentage value");
        _refundPercentFee = fee;
    }

    function getLeasable(uint256 _tokenId) external view returns(bool) {
        if(leasable[_tokenId]) return true;
        else return false;
    }

    function setTokenLeasable(uint256 _tokenId, uint256 _price, uint32 _duration) external onlyOwnerOf(_tokenId) {
        require(_price >= _nft.getTierPrice(_nft.getTierNumberOf(_tokenId)) / 10, "Amount of ether sent is not correct.");
        require(_duration >= 30, "The minimum to lease the membership is 30 days.");

        LeasableToken memory leasableToken = getLeasableToken(_tokenId);
        require(leasableToken.tokenId == 0, "Token is already leasable");
        _leasableTokens.push(LeasableToken(_tokenId, _price, _duration));
        leasable[_tokenId] = true;
    }

    function getLeasableToken(uint256 _tokenId) public view returns(LeasableToken memory) {
        LeasableToken memory leasableToken;
        for(uint256 i = 0; i < _leasableTokens.length; i++) {
            if(_leasableTokens[i].tokenId == _tokenId) {
                leasableToken = _leasableTokens[i];
                break;
            }
        }

        return leasableToken;
    }

    function getLease(uint256 _tokenId) external view returns(LeaseOffer memory) {
        LeaseOffer memory leaseItem = _lease[_tokenId];
        return leaseItem;
    }

    function updateLeasableToken(uint256 _tokenId, uint256 _price, uint32 _duration) external onlyOwnerOf(_tokenId) {
        require(_price >= _nft.getTierPrice(_nft.getTierNumberOf(_tokenId)) / 10, "Amount of ether sent is not correct.");
        require(_duration >= 30, "The minimum to lease the membership is 30 days.");
        
        LeasableToken memory leasableToken = getLeasableToken(_tokenId);
        require(leasableToken.tokenId != 0, "Token is not leasable");
        for(uint256 i = 0; i < _leasableTokens.length; i++) {
            if(_leasableTokens[i].tokenId == _tokenId) {
                _leasableTokens[i].price = _price;
                _leasableTokens[i].duration = _duration;
                break;
            }
        }
    }

    function cancelTokenLeasable(uint256 _tokenId) external onlyOwnerOf(_tokenId) {
        for(uint256 i = 0; i < _leasableTokens.length; i++) {
            if (_leasableTokens[i].tokenId == _tokenId) {
                _leasableTokens[i] = _leasableTokens[_leasableTokens.length - 1];
                _leasableTokens.pop();
                break;
            }
        }
    }

    function getLeasableTokens() external view returns(LeasableToken[] memory) {
        return _leasableTokens;
    }

    function getLeaseOffers(uint256 _tokenId) external view returns(LeaseOffer[] memory) {
        return leaseOffers[_tokenId];
    }

    function trasferWeth(address from, address to, uint256 amount) public returns(bool) {
        return _weth.transferFrom(from, to, amount);
    }

    function approveLeaseOffer(uint256 _tokenId, address _from) external onlyOwnerOf(_tokenId) {
        LeaseOffer[] memory tokenLeaseOffers = leaseOffers[_tokenId];

        for(uint256 i = 0; i < tokenLeaseOffers.length; i++) {
            if(tokenLeaseOffers[i].from == _from) {
                (address royaltyReceiver, uint256 roaltyAmount) = getRoalityInfo(_tokenId, tokenLeaseOffers[i].price);

                // transfer WETH from lease offer maker to the owner
                bool success1 = trasferWeth(_from, address(_nft.ownerOf(_tokenId)), (tokenLeaseOffers[i].price * 9) / 10);
                require(success1, "Failed to Pay Royalty fee");
                // transfer royalty fee from lease offer maker to royalty receiver
                bool success2 = trasferWeth(_from, royaltyReceiver, roaltyAmount);
                require(success2, "Failed to Pay Royalty fee");
                
                tokenLeaseOffers[i].createdAt = block.timestamp;
                _lease[_tokenId] = tokenLeaseOffers[i];
                leaseOffers[_tokenId][i] = leaseOffers[_tokenId][leaseOffers[_tokenId].length -1];
                leaseOffers[_tokenId].pop();

                _addrToLeasingTokens[_from].push(_tokenId);

                emit ApproveLeasing(_tokenId);
                break;
            }
        }
        _offerState[_tokenId][_from] = false;
    }

    function calcenLeaseOffer(uint256 _tokenId) external {
        require(_nft.ownerOf(_tokenId) != msg.sender, "You can't buy yours.");
        require(_nft.ownerOf(_tokenId) != address(0), "You can't send offer no-owner token");
        LeaseOffer[] memory tokenLeaseOffers = leaseOffers[_tokenId];

        for(uint256 i = 0; i < tokenLeaseOffers.length; i++) {
            if(tokenLeaseOffers[i].from == msg.sender) {
                leaseOffers[_tokenId][i] = leaseOffers[_tokenId][leaseOffers[_tokenId].length - 1];
                leaseOffers[_tokenId].pop();

                emit ApproveLeasing(_tokenId);
                break;
            }
        }

        _offerState[_tokenId][msg.sender] = false;
    }

    function sendLeaseOffer(uint256 _tokenId, uint256 _amount, uint32 _expiresIn) public payable {
        require(_nft.ownerOf(_tokenId) != msg.sender, "You can't buy yours.");
        require(_nft.ownerOf(_tokenId) != address(0), "You can't send offer no-owner token");
        require(_amount >= _nft.getTierPrice(_nft.getTierNumberOf(_tokenId)) / 10, "Amount of ether sent is not correct.");
        require(_weth.balanceOf(msg.sender) >= _amount, "You don't have enough WETH.");
        require(_expiresIn >= 30, "The minimum to lease the membership is 30 days.");
        require(_offerState[_tokenId][msg.sender] != true, "You can't send mutli offer");
        leaseOffers[_tokenId].push(LeaseOffer(msg.sender, _amount, _expiresIn, block.timestamp));
        _offerState[_tokenId][msg.sender] = true;
    }

    function lease(uint256 _tokenId, uint32 _expiresIn) external payable {
        require(_nft.ownerOf(_tokenId) != msg.sender, "You can't buy yours.");
        require(leasable[_tokenId], "Token is not public");
        require(_nft.ownerOf(_tokenId) != address(0), "You can't send offer no-owner token");
        require(msg.value >= _nft.getTierPrice(_nft.getTierNumberOf(_tokenId)) / 10, "Amount of ether sent is not correct.");

        (address royaltyReceiver, uint256 roaltyAmount) = getRoalityInfo(_tokenId, msg.value);
        address payable _royaltyReceiver = payable(royaltyReceiver);
        (bool success1, ) = _royaltyReceiver.call{ value: roaltyAmount }("");
        require(success1, "Failed to Pay Royalty fee");

        _lease[_tokenId] = LeaseOffer(msg.sender, msg.value, _expiresIn, block.timestamp);
        leasable[_tokenId] = false;
        

        for(uint256 i = 0; i < _leasableTokens.length; i++) {
            if (_leasableTokens[i].tokenId == _tokenId) {
                _leasableTokens[i] = _leasableTokens[_leasableTokens.length - 1];
                _leasableTokens.pop();
                break;
            }
        }
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
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
        
        return string(bstr);
    }
}