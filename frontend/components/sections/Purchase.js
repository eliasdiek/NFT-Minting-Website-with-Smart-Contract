import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import QuantitySelector from '../inputs/QuantitySelector';
import WalletConnection from '../blocks/WalletConnection';
import Cart from '../blocks/Cart';
import { Ether } from '../icons';
import { useSelector } from "react-redux";
import Web3 from 'web3';
import CoinGecko from 'coingecko-api';

const MAX_MINTABLE = 2;

const initial_nft_prices = [
    {
        name: 'Power',
        usdPrice: 5000,
        ethPrice: 0
    },
    {
        name: 'Power',
        usdPrice: 10000,
        ethPrice: 0
    },
    {
        name: 'Power',
        usdPrice: 15000,
        ethPrice: 0
    }
];

export default function Purchase() {
    const router = useRouter();
    const [qty, setQty] = useState(1);
    const [ethPrice, setEthPrice] = useState(0);
    const [nftPrices, setNftPrices] = useState(initial_nft_prices);
    const [balance, setBalance] = useState(0);
    const [memberShip, setMemberShip] = useState('');
    const walletAddr = useSelector((state) => state.address);

    async function init() {
        try {
            const CoinGeckoClient = new CoinGecko();

            let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
                coin_ids: ['ethereum']
            });

            const ethPrice = data.data.tickers.filter(ticker => ticker.target === 'USD')[0].last;
            _nftPrices = nftPrices.map(nftPrice => {
                nftPrice.ethPrice = parseFloat(nftPrice.usdPrice / ethPrice).toFixed(4);

                return nftPrice;
            });

            setEthPrice(ethPrice);
            setNftPrices(_nftPrices);
    
            console.log('[data]', ethPrice);
        }
        catch(err) {
            console.log('[err]', err);
        }
    }

    async function getBalance(addr) {
        if (window == undefined) return false;

        const { ethereum } = window;
        var web3 = new Web3(ethereum);
        const wei =  await web3.eth.getBalance(addr);
        const balance = web3.utils.fromWei(wei);

        setBalance(balance);
    }

    function increment() {
        if (qty == MAX_MINTABLE) return false;

        setQty(qty + 1);
    }

    function decrement() {
        if (qty == 0) return false;

        setQty(qty - 1);
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        console.log('router]', router.query?.membership)
        if (walletAddr) getBalance(walletAddr);
    }, [walletAddr]);

    useEffect(() => {
        setMemberShip(router.query?.membership);
    }, [router]);

    return (
        <React.Fragment>
            <div className="container w-4/5">

                <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 px-2 py-4 sm:py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="image-block">
                            <Image src={`/tokens/Power/images/08001.png`} className="block" width={600} height={600} />
                        </div>

                        <div className="px-5">
                            <h5 className="font-medium font-muli text-4xl py-2 mb-4">{memberShip} Membership</h5>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs uppercase mb-4">ETH Price</div>
                                    <div className="flex items-center">
                                        <span className="h-12 flex items-center">
                                            <Ether width={'2rem'} height={'2rem'} />
                                        </span>
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white h-12 flex items-center ml-0">
                                            { ethPrice ? nftPrices.filter(nftPrice => nftPrice.name == memberShip)[0]?.ethPrice : '--' }
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <QuantitySelector
                                     counter={qty}
                                     increment={increment}
                                     decrement={decrement}
                                     min={0}
                                     max={MAX_MINTABLE}
                                    />
                                </div>
                            </div>

                            <div className="py-4">
                                <h6 className="font-light font-muli text-2xl py-2">NFT Description</h6>
                                <p className="py-2 font-normal text-base">This token represents your ownership of membership to our yacht club.</p>
                                <p className="py-2 font-normal text-base">As a Power member, you will have access to charter exclusive VIP yachts 36ft -50ft </p>
                                <p className="py-2 font-normal text-base">As a member, can bring up to 2 guests per token. </p>
                                <p className="py-2 font-normal text-base">This token is also a collectible that lives on the Ethereum blockchain.</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    className={`w-full uppercase bg-gradient-to-br from-background-primary to-background-secondary text-17px text-white py-3 px-9 rounded-full font-pop font-semibold ${walletAddr && balance && qty > 0 && ethPrice ? 'opacity-1' : 'opacity-50 cursor-not-allowed'}`}                                    disabled={walletAddr && balance && qty > 0 && ethPrice > 0 ? false :  true}
                                    onClick={init}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-4">
                    <WalletConnection />
                </div>

                <div>
                    <Cart />
                </div>

            </div>
        </React.Fragment>
    );
};