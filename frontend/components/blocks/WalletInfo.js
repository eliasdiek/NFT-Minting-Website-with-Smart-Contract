import React from 'react';
import { PowerOff } from '../icons';

export default function WalletInfo({ walletName, walletIcon, walletAddr, balance, walletDisconnect }) {
    function truncate(string) {
        const input = String(string);
        return input.substr(0, 6) + '...' + input.substr(input.length - 4);
    }

    return (
        <div className="px-4 border rounded-xl border-gray-200">
            <div className="pt-6 pb-2 flex items-center justify-center">
                { walletIcon }
                <h4 className="text-2xl font-normal ml-4">{ walletName } Wallet Connected</h4>
            </div>

            <div className="my-4 grid grid-cols-1 sm:grid-cols-3">
                <div className="flex flex-col justify-center items-center mb-4 sm:mb-0">
                    <p className="text-sm font-light uppercase mb-2">Your Wallet Address</p>
                    <p className="text-sm font-medium">{ truncate(walletAddr) }</p>
                </div>
                <div className="flex flex-col justify-center items-center mb-4 sm:mb-0">
                    <p className="text-sm font-light uppercase mb-2">Balance</p>
                    <p className="text-sm font-medium">{ balance } ETH</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <button className="flex items-center mb-2 focus:ring-2 rounded-full px-2">
                        <PowerOff width="16px" height="16px" />
                        <span className="ml-2 text-sm" onClick={walletDisconnect}>Disconnect Wallet</span>
                    </button>
                    <p className={`text-sm font-medium ${balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {`${ balance > 0 ? 'Sufficient funds' : 'Insufficient funds' }`}
                    </p>
                </div>
            </div>
        </div>
    );
};