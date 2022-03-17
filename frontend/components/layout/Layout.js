import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useSelector, useDispatch } from "react-redux";
import { init, setWalletAddress, setWalletId, openSignin } from '../../store/actions';

import { useWeb3React } from '@web3-react/core';
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import Modal from '../modals/Modal';
import WalletConnector from '../modals/WalletConnector';
import { Metamask, Coinbase, WalletConnectIcon } from '../icons';

const headerMenu = [
    {
        title: 'Home',
        link: '/',
        active: true,
        desktop: true
    },
    {
        title: 'About',
        link: '/about',
        active: false,
        desktop: true
    },
    {
        title: 'Locations',
        link: '/locations',
        active: false,
        desktop: true
    },
    {
        title: 'Contact',
        link: '/contact',
        active: false,
        desktop: true
    },
    {
        title: 'Explore',
        link: '/explore',
        active: false,
        desktop: true
    },
    {
        title: 'My Collections',
        link: '/account/collections',
        active: false,
        desktop: false
    }
];

const footerMenu = [
    {
        title: 'Home',
        link: '/',
        active: true
    },
    {
        title: 'About',
        link: '/about',
        active: false
    },
    {
        title: 'Contact',
        link: '/contact',
        active: false
    }
];

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

export default function Layout(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenMetamask, setIsOpenMetamask] = useState(false);
    const { activate, deactivate } = useWeb3React();
    const [walletAddr, setWalletAddr] = useState();
    const { active, chainId, account } = useWeb3React();
    const dispatch = useDispatch();
    const address = useSelector((state) => state.address);
    const walletId = useSelector((state) => state.walletId);
    const openSigninModal = useSelector((state) => state.openSignin);

    function onSetWalletId(id) {
        dispatch(setWalletId(id));
    }

    function closeModal() {
        dispatch(openSignin(false));
    }
    
    function openModal() {
        dispatch(openSignin(true));
    }

    const openMetamaskModal = () => {
        closeModal();
        setIsOpenMetamask(true);
    }

    useEffect(() => {
        dispatch(init());
    }, [dispatch]);  

    useEffect(() => {
        console.log('[address]', address);
        setWalletAddr(address);
    }, [address]);

    useEffect(() => {
        if (active) {
            console.log('[chainId]', chainId);
            dispatch(openSignin(false));
            setWalletAddr(account);
            dispatch(setWalletAddress(account));
        }
    }, [active, account, dispatch]);
    
    return (
        <React.Fragment>
            <header className="w-full shadow-sm shadow-shadow sm:fixed top-0 bg-white z-20">
                <Header headerMenu={headerMenu} />
            </header>
            {props.children}
            <footer className="w-full bg-background-dark">
                <Footer footerMenu={footerMenu} />
            </footer>

            <WalletConnector
             isOpen={openSigninModal}
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
        </React.Fragment>
    );
};