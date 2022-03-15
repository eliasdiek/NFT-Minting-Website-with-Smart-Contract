import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WalletConnector from '../modals/WalletConnector';
import WalletInfo from './WalletInfo';
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

export const useBalance = async () => {
    const walletAddr = useSelector((state) => state.address);

    async function getBalance(addr) {
        if (window == undefined) return false;

        const { ethereum } = window;
        var web3 = new Web3(ethereum);
        const wei =  await web3.eth.getBalance(addr);
        const balance = web3.utils.fromWei(wei);

        return balance;
    }

    const balance = walletAddr ? await getBalance(walletAddr) : 0;

    return {
        walletAddr,
        balance
    };
};

export default function WalletConnection() {
    const [isOpen, setIsOpen] = useState(false);
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
        if (activate) await deactivate();
        setWalletAddr('');
        dispatch(removeWalletAddress());
    }

    async function getBalance(addr) {
        if (window == undefined) return false;

        const { ethereum } = window;
        var web3 = new Web3(ethereum);
        const wei =  await web3.eth.getBalance(addr);
        const balance = web3.utils.fromWei(wei);

        setBalance(balance);
    }

    const mint = () => {
        const { ethereum } = window;

        ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
            console.log(accounts)
            console.log(abi)
            var w3 = new Web3(ethereum)
            var contract_abi = new w3.eth.Contract(abi, "0x6b28D74A819e113cdB9067190B2cF463061e38b8")
            contract_abi.methods.mintBatch("1").send({from: accounts[0], value: w3.utils.toWei("0.01")}).then(() => {})
        }).catch((err) => console.log(err));
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
                active || walletAddr ? (
                    <WalletInfo
                     walletName={wallets[walletId].name}
                     walletIcon={wallets[walletId].icon}
                     walletAddr={walletAddr}
                     balance={balance}
                     walletDisconnect={walletDisconnect}
                    />
                ) : (
                    <div className="p-4 text-center mt-8">
                        <button className="rounded-full text-xl py-4 px-12 bg-background-primary text-white font-semibold" onClick={openModal}>Connect Wallet To Begin</button>
                    </div>
                )
            }

            <WalletConnector
             isOpen={isOpen}
             closeModal={closeModal}
             activate={activate}
             wallets={wallets}
             onSetWalletId={onSetWalletId}
            />
        </div>
    );
};