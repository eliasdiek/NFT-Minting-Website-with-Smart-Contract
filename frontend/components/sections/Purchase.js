import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import QuantitySelector from '../inputs/QuantitySelector';
import WalletConnection from '../blocks/WalletConnection';
import Cart from '../blocks/Cart';
import { Ether } from '../icons';
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from '../../store/actions';
import Web3 from 'web3';
import axios from 'axios';

const { abi } = require("../../contracts/FathomyachtClub.json");
const contractAddress = '0x72363A6192d7e891c8636a349c90975569B0745c';

const MAX_MINTABLE = 2;

const initialTiers = [
    {
        tierNumber: 0,
        name: 'Power',
        usdPrice: 50,
        ethPrice: 0
    },
    {
        tierNumber: 1,
        name: 'Yacht',
        usdPrice: 100,
        ethPrice: 0
    },
    {
        tierNumber: 2,
        name: 'Prestige',
        usdPrice: 150,
        ethPrice: 0
    }
];

export default function Purchase() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const [error, setError] = useState('');
    const [ethPrice, setEthPrice] = useState(0);
    const [tiers, setTiers] = useState(initialTiers);
    const [balance, setBalance] = useState(0);
    const [memberShip, setMemberShip] = useState('');
    const walletAddr = useSelector((state) => state.address);
    const cart = useSelector((state) => state.cart);

    async function init() {
        try {
            let result = await axios.get('/api/coinmarketcap');

            const ethPrice = result.data.eth;
            const _tiers = tiers.map(tier => {
                tier.ethPrice = parseFloat(tier.usdPrice / ethPrice).toFixed(4);

                return tier;
            });

            setEthPrice(ethPrice);
            setTiers(_tiers);
    
            console.log('[ethPrice]', ethPrice, _tiers);
        }
        catch(err) {
            console.log('[err]', err);
        }
    }

    async function cartToAdd(e) {
        setError("");
        const tier = tiers.find(tier => tier.name == memberShip);
        let totalQty = qty;
        const existingQty = cart.find(item => item.membership === memberShip)?.qty;
        console.log('existingQty]', existingQty);
        if (existingQty) totalQty += existingQty;
        if (totalQty > 2) setError("You can't buy more than 2 tokens at once!");
        else {
            dispatch(
                addToCart(
                    tier?.tierNumber,
                    memberShip,
                    qty,
                    tier?.ethPrice
                )
            );
            scrollTo(e, 'cart-container');
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

    const scrollTo = (e, id) => {
        e.preventDefault();

        try {
            const width = window.innerWidth;
            const adder = 100;

            if (width < 768) {
                adder = 15;
            }

            const elem = document.getElementById(id);
            const height = elem.offsetTop - adder;
            window.scrollTo(0, height);
        }
        catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        init();

        setInterval(() => {
            init();
        }, 30 * 60 * 1000); // fetch & set the ether price in every 5 minutes
    }, []);

    useEffect(() => {
        console.log('router]', router.query?.membership)
        if (walletAddr) getBalance(walletAddr);
    }, [walletAddr]);

    useEffect(() => {
        setMemberShip(router.query?.membership);
    }, [router]);

    if (!ethPrice) return (
        <React.Fragment>
            <div className="container flex items-center justify-center">
                <span className="block animate-spin bg-transparent border-3 border-t-primary rounded-full h-10 w-10"></span>
            </div>
        </React.Fragment>
    );

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
                                            { ethPrice ? tiers.find(tier => tier.name == memberShip)?.ethPrice : '--' }
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

                            { error && <div className="font-medium text-base text-center mt-4 bg-red-100 p-4 text-red-800">{error}</div> }

                            <div className="py-4">
                                <h6 className="font-light font-muli text-2xl py-2">NFT Description</h6>
                                <p className="py-2 font-normal text-base">This token represents your ownership of membership to our yacht club.</p>
                                <p className="py-2 font-normal text-base">As a Power member, you will have access to charter exclusive VIP yachts 36ft -50ft </p>
                                <p className="py-2 font-normal text-base">As a member, can bring up to 2 guests per token. </p>
                                <p className="py-2 font-normal text-base">This token is also a collectible that lives on the Ethereum blockchain.</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    className={`w-full uppercase bg-gradient-to-br from-background-primary to-background-secondary text-17px text-white py-3 px-9 rounded-full font-pop font-semibold ${walletAddr && balance && qty > 0 && ethPrice ? 'opacity-1' : 'opacity-50 cursor-not-allowed'}`}
                                    disabled={walletAddr && balance && qty > 0 && ethPrice > 0 ? false :  true}
                                    onClick={cartToAdd}
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

                {
                    walletAddr && balance > 0 &&
                    <div id="cart-container">
                        <Cart memberShip={memberShip} />
                    </div>
                }

            </div>
        </React.Fragment>
    );
};