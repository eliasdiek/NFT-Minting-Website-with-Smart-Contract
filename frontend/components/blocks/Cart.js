import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeCartItem } from '../../store/actions';
import Web3 from 'web3';

export default function Cart() {
    const { abi } = require("../../contracts/FathomyachtClub.json");
    const contractAddress = '0xbF57863aB1aF9F11C1faF2D4eA385E884a6ffD21';

    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    function removeItem(index) {
        dispatch(removeCartItem(index));
    }

    function mint() {
        const { ethereum } = window;

        ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
            console.log(accounts);
            console.log(abi);
            var w3 = new Web3(ethereum);
            var contract_abi = new w3.eth.Contract(abi, contractAddress);
            contract_abi.methods.mintBatch("1", "0").send({from: accounts[0], value: w3.utils.toWei("0.017")}).then((result) => { console.log('[result]', result) });
        }).catch((err) => console.log(err));
    }

    async function getTierPrice() {
        const tierNumber = 2;
        var w3 = new Web3(ethereum);
        var contract_abi = new w3.eth.Contract(abi, w3.utils.toChecksumAddress(contractAddress));
        const tierPrice = w3.utils.fromWei(await contract_abi.methods.getTierPrice(tierNumber).call());
        console.log('[tierPrice]', tierPrice);

        return tierPrice;
    }

    useEffect(() => {
        console.log('[cart]', cart);
    }, [cart]);

    return (
        <div className="p-4 border rounded-xl border-gray-200">
            <h2 className="font-light text-3xl py-2 mb-4 font-muli">Checkout</h2>
            <div className="py-2">
                <h4 className="font-medium mb-4">Please review your order selection</h4>

                <div className="py-2">
                    <div className="grid grid-cols-4 border-b border-gray-300">
                        <div className="uppercase text-xs font-light text-left p-4">Membership</div>
                        <div className="uppercase text-xs font-light text-center p-4">Quantity</div>
                        <div className="uppercase text-xs font-light text-right p-4">Price</div>
                        <div className="uppercase text-xs font-light text-right p-4"></div>
                    </div>
                    {
                        cart?.length ? (
                            cart.map((item, index) => {
                                return (
                                    <div className="grid grid-cols-4 border-b border-gray-300" key={index}>
                                        <div className="uppercase text-sm font-medium text-left p-4">{item.membership}</div>
                                        <div className="uppercase text-sm font-medium text-center p-4">{item.qty}</div>
                                        <div className="uppercase text-sm font-medium text-right p-4">{item.price}</div>
                                        <div className="uppercase text-sm font-medium text-right p-4">
                                            <button className="uppercase underline text-primary" onClick={() => removeItem(index)}>Remove</button>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-2xl text-center font-light py-6">Your cart is empty</div>
                        )
                    }
                    <div className="border-t gray-300 w-full h-1"></div>
                    <div className="flex items-center justify-end pt-8 text-base">
                        <div className="w-full lg:w-1/3">
                            <div className="py-4 flex items-center justify-between">
                                <span>Subtotal</span>
                                <span>0.0 ETH</span>
                            </div>
                            <div className="py-4 flex items-center justify-between">
                                <span>Gas*</span>
                                <span>0.00000029 ETH</span>
                            </div>
                            <div className="border-t border-gray-300 font-medium py-4 flex items-center justify-between">
                                <span>Total</span>
                                <span>0.00000029 ETH</span>
                            </div>
                        </div>
                    </div>

                    <div className="py-8 text-center">
                        <button
                         className={`uppercase bg-gradient-to-br from-background-primary to-background-secondary text-17px text-white py-3 px-9 rounded-full font-pop font-semibold focus:ring-4 ${cart.length > 0 ? 'opacity-1' : 'opacity-50 cursor-not-allowed'}`}
                         disabled={cart.length > 0 ? false :  true}
                         onClick={mint}
                        >
                            Continue to Purchase
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};