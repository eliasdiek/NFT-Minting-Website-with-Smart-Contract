import React, { useState, useEffect } from 'react';
import WalletConnector from '../modals/WalletConnector';
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core';
import { Metamask, Coinbase, WalletConnectIcon, PowerOff } from '../icons';
import Web3 from 'web3';

const CoinbaseWallet = new WalletLinkConnector({
    url: `https://rinkeby.infura.io/v3/acb6066fc0de47f69a8740946a3ef833`,
    appName: "Fathom Yacht Club",
    supportedChainIds: [1, 3, 4, 5, 42],
});

const WalletConnect = new WalletConnectConnector({
    rpcUrl: `https://rinkeby.infura.io/v3/acb6066fc0de47f69a8740946a3ef833`,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
});

const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
});

const wallets = [
    {
        name: 'MetaMask',
        label: 'MetaMask',
        key: 'metamask',
        icon: <Metamask />,
        action: Injected
    },
    {
        name: 'Coinbase Wallet',
        label: 'Coinbase',
        key: 'coinbase',
        icon: <Coinbase />,
        action: CoinbaseWallet
    },
    {
        name: 'WalletConnect',
        label: 'WalletConnect',
        key: 'wallet_connect',
        icon: <WalletConnectIcon />,
        action: WalletConnect
    },
];

export default function MemberShip({ memberShips }) {
    const [isOpen, setIsOpen] = useState(false);
    const [walletId, setWalletId] = useState(0);
    const [balance, setBalance] = useState(0);
    const { activate, deactivate, } = useWeb3React();
    const { active, chainId, account, library } = useWeb3React();

    // console.log('[active]', active, chainId, account, library);

    function closeModal() {
      setIsOpen(false);
    }
  
    function openModal() {
      setIsOpen(true);
    }

    function truncate(string) {
        const input = String(string);
        return input.substr(0, 6) + '...' + input.substr(input.length - 4);
    }

    function walletDisconnect() {
        deactivate();
    }

    async function getBalance() {
        var web3 = new Web3(library.provider);
        const wei =  await web3.eth.getBalance(account);
        const balance = web3.utils.fromWei(wei);

        console.log('[balance]', wei);

        setBalance(balance);
    }

    useEffect(() => {
        if (active) {
            setIsOpen(false);
            getBalance();
        }
    }, [active]);

    return (
        <div className="w-full">
            <div className="grid grid-rows-3 sm:grid-rows-1 sm:grid-cols-4 gap-0.5">
                {/* left menu for desktop */}
                {
                    memberShips.slice(0, 1).map((memberShip, i) => {
                        return (
                            <div className={`hidden sm:block`} key={memberShip.name}>
                                <div className={`block ${i !== 0 && 'sm:hidden'}`}>
                                    <div className="font-semibold bg-background-secondary mb-0.5 p-4">&nbsp;</div>
                                    {
                                        memberShip.options.map((option, index) => {
                                            return (
                                                <div className="bg-background-secondary mb-0.5 flex items-center justify-start h-auto sm:h-16 py-4 px-2 text-left" key={`${index}`}>
                                                    <span className="text-xl font-light">{option.title}&nbsp;</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                {
                    memberShips.map((memberShip, i) => {
                        return (
                            <div className={`grid grid-cols-1 text-center sm:grid-cols-1 mb-4 sm:mb-0`} key={memberShip.name}>
                                <div className="block">
                                    <div className="font-semibold bg-background-light mb-0.5 p-4">{ memberShip.name }</div>
                                    {
                                        memberShip.options.map((option, index) => {
                                            return (
                                                <div className="grid grid-cols-2 sm:grid-cols-1" key={`${memberShip.name}-${index}`}>
                                                    <div className="flex sm:hidden bg-background-secondary mb-0.5 items-center justify-center py-4 px-2 text-center">{ option.title }</div>
                                                    <div className="bg-background-light mb-0.5 flex items-center justify-center h-auto sm:h-16 py-4 px-2 text-center">
                                                        {
                                                            option.type !== 'Boolean' ? <span className="text-lg font-light">{option.value}&nbsp;</span> : (
                                                                option.value ? <span>✔</span> : <span>&nbsp;</span>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="grid grid-cols-1">
                                        <div className="mb-0.5 flex items-center justify-center h-auto py-4 px-4 text-center">
                                            <button className="w-full uppercase bg-gradient-to-br from-background-primary to-background-secondary text-17px text-white py-3 px-9 rounded-full font-pop font-semibold">Buy now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            { !active ? <div className="p-4 text-center mt-8">
                <button className="rounded-full text-xl py-4 px-12 bg-background-primary text-white font-semibold" onClick={openModal}>Connect Wallet To Begin</button>
            </div> : (
                <div className="px-4">
                    <div className="pt-6 pb-2 flex items-center justify-center">
                        { wallets[walletId].icon }
                        <h4 className="text-2xl font-normal ml-4">{ wallets[walletId].name } Wallet Connected</h4>
                    </div>

                    <div className="my-4 grid grid-cols-1 sm:grid-cols-3">
                        <div className="flex flex-col justify-center items-center mb-4 sm:mb-0">
                            <p className="text-sm font-light uppercase mb-2">Your Wallet Address</p>
                            <p className="text-sm font-medium">{ truncate(account) }</p>
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
                            <p className={`text-sm font-medium ${balance ? 'text-green-600' : 'text-red-600'}`}>{`${ balance ? 'Sufficient funds' : 'Insufficient funds' }`}</p>
                        </div>
                    </div>
                </div>
            ) }

            <WalletConnector
             isOpen={isOpen}
             closeModal={closeModal}
             activate={activate}
             wallets={wallets}
             setWalletId={setWalletId}
            />
        </div>
    );
};