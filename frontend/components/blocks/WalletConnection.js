import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WalletConnector from '../modals/WalletConnector';
import Modal from '../modals/Modal';
import WalletInfo from './WalletInfo';
import Button from '../buttons/Button';
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core';
import { Metamask, Coinbase, WalletConnectIcon } from '../icons';
import Web3 from 'web3';
import { useSelector, useDispatch } from "react-redux";
import { setWalletAddress, removeWalletAddress, setWalletId } from '../../store/actions';

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

export default function WalletConnection() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenMetamask, setIsOpenMetamask] = useState(false);
    const [balance, setBalance] = useState(0);
    const { activate, deactivate } = useWeb3React();
    const [walletAddr, setWalletAddr] = useState();
    const { active, chainId, account } = useWeb3React();
    const router = useRouter();
    
    const dispatch = useDispatch();
    const address = useSelector((state) => state.address);
    const walletId = useSelector((state) => state.walletId);

    function closeModal() {
      setIsOpen(false);
    }
  
    function openModal() {
      setIsOpen(true);
    }

    function onSetWalletId(id) {
        dispatch(setWalletId(id));
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

    const openMetamaskModal = () => {
        closeModal();
        setIsOpenMetamask(true);
    }

    useEffect(() => {
            console.log('[address]', address);
            setWalletAddr(address);

            if (address) getBalance(address);
    }, [address]);

    useEffect(() => {
        if (active) {
            setIsOpen(false);
            setWalletAddr(account);
            getBalance(account);
            dispatch(setWalletAddress(account));
        }
    }, [active, account, dispatch]);

    return (
        <div className="w-full">
            {
                (active || walletAddr) && typeof walletId !== undefined ? (
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

            <WalletConnector
             isOpen={isOpen}
             closeModal={closeModal}
             activate={activate}
             wallets={wallets}
             onSetWalletId={onSetWalletId}
             openMetamaskModal={openMetamaskModal}
            />

            <Modal isOpen={isOpenMetamask} openModal={() => { setIsOpenMetamask(true) }} closeModal={() => { setIsOpenMetamask(false) }}>
                <div className="px-8">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="flex items-center justify-center py-2">
                            <Metamask />
                        </div>
                        <h4 className="ml-2 text-xl">Try the Metamask Wallet extension</h4>
                    </div>
                    <div className="py-4 text-center">
                        <a
                         href="https://metamask.app.link/dapp/fathomyachtclub.com" target="_blank" rel="noreferrer"
                         className="bg-primary rounded-md py-3 px-8 text-white text-base"
                        >
                            Install
                        </a>
                    </div>
                </div>
            </Modal>
        </div>
    );
};