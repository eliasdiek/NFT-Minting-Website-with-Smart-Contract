import React, { useState, useEffect } from 'react';
import WalletInfo from './WalletInfo';
import Button from '../buttons/Button';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { useSelector, useDispatch } from "react-redux";
import { removeWalletAddress, openSignin } from '../../store/actions';
import { Metamask, Coinbase, WalletConnectIcon } from '../icons';

const wallets = [
    {
        name: 'MetaMask',
        label: 'MetaMask',
        key: 'metamask',
        icon: <Metamask />
    },
    {
        name: 'Coinbase Wallet',
        label: 'Coinbase',
        key: 'coinbase',
        icon: <Coinbase />
    },
    {
        name: 'WalletConnect',
        label: 'WalletConnect',
        key: 'wallet_connect',
        icon: <WalletConnectIcon />
    },
];

export default function WalletConnection() {
    const [balance, setBalance] = useState(0);
    const { activate, deactivate } = useWeb3React();
    const [walletAddr, setWalletAddr] = useState();

    const dispatch = useDispatch();
    const address = useSelector((state) => state.address);
    const walletId = useSelector((state) => state.walletId);
  
    function openModal() {
        dispatch(openSignin(true));
    }

    async function walletDisconnect() {
        try {
            if (activate) await deactivate();
            setWalletAddr('');
            dispatch(removeWalletAddress());
        }
        catch (err) {
            console.log('[err]', err);
        }
    }

    async function getBalance(addr) {
        try {
            if (typeof window == undefined) return false;

            const { ethereum } = window;
            if (!ethereum) return;
            var web3 = new Web3(ethereum);
            const wei =  await web3.eth.getBalance(addr);
            const balance = web3.utils.fromWei(wei);
    
            setBalance(balance);
        }
        catch (err) {
            console.log('[err]', err);
        }
    }

    useEffect(() => {
            setWalletAddr(address);

            if (address) getBalance(address);
    }, [address]);

    return (
        <div className="w-full">
            {
                walletAddr && typeof walletId !== undefined ? (
                    <WalletInfo
                     walletName={wallets[walletId].name}
                     walletIcon={wallets[walletId].icon}
                     walletAddr={walletAddr}
                     balance={balance}
                     walletDisconnect={walletDisconnect}
                    />
                ) : (
                    <div className="p-4 text-center mt-8">
                        <Button theme="secondary" className="w-auto m-auto" onClick={openModal}>
                            Connect Wallet To Begin
                        </Button>
                    </div>
                )
            }
        </div>
    );
};