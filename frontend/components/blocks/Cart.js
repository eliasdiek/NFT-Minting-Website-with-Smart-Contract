import React from 'react';

export default function Cart() {
    return (
        <div className="p-4 border rounded-xl border-gray-200">
            <h2 className="font-light text-3xl py-2 mb-4 font-muli">Checkout</h2>
            <div className="py-2">
                <h4 className="font-medium mb-4">Please review your order selection</h4>

                <div className="py-2">
                    <div className="grid grid-cols-4 border-b border-gray-300">
                        <div className="uppercase text-xs font-light text-left p-4">Selection</div>
                        <div className="uppercase text-xs font-light text-center p-4">Quantity</div>
                        <div className="uppercase text-xs font-light text-center p-4">Design</div>
                        <div className="uppercase text-xs font-light text-right p-4">Price</div>
                    </div>
                    <div className="text-2xl text-center font-light py-6">Your cart is empty</div>
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
                        <button className="uppercase bg-gradient-to-br from-background-primary to-background-secondary text-17px text-white py-3 px-9 rounded-full font-pop font-semibold">Continue to Purchase</button>
                    </div>
                </div>
            </div>
        </div>
    );
};