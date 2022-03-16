import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Collection from '../components/sections/Collection';
import { useSelector } from 'react-redux';
import Web3 from 'web3';
import axios from 'axios';

const { abi } = require("../contracts/FathomyachtClub.json");
const contractAddress = '0xF16EB26739C290e83B7311C16596F3209890e5Fd';
const tokenBatchURI = "https://gateway.pinata.cloud/ipfs/QmRgmtg7T8nL3iP81eg3gTWd6WHUjs75M4FzGYx9cthYCg";

export default function Location() {
    const [myTokens, setMyTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const walletAddr = useSelector((state) => state.address);
    const router = useRouter();

    const getTokens = async () => {
        try {
            setLoading(true);
            const { ethereum } = window;
            var w3 = new Web3(ethereum);
            var contract_abi = new w3.eth.Contract(abi, w3.utils.toChecksumAddress(contractAddress));
            const tokens = await contract_abi.methods.getTokensOfHolder(walletAddr).call();
            const metas = [];
            for(let i = 0; i < tokens.length; i++) {

                const metaData = await axios.get(tokenBatchURI + '/' + tokenIdToString(tokens[i]));
                metas.push(metaData?.data);
            }
            console.log('[metas]', metas);
            setLoading(false);
            setMyTokens(metas);
        }
        catch(err) {
            console.log('[err]', err);
        }
    }

    const tokenIdToString = (tokenId) => {
        let prefix = '';
        if (tokenId == 0) {
          return "0";
        }
        else if (tokenId > 0 && tokenId < 10) {
          prefix = '0000';
        }
        else if (tokenId >= 10 && tokenId < 100) {
          prefix = '000';
        }
        else if (tokenId >= 100 && tokenId < 1000) {
          prefix = '00';
        }
        else if (tokenId >= 1000 && tokenId < 10000) {
          prefix = '0';
        }

        return prefix + String(tokenId);
    }

    const onTokenClick = (tokenId) => {
        router.push('/tokens/' + tokenId);
    }

    // useEffect(() => {
    //     if (walletAddr === "" || walletAddr === undefined || walletAddr === null) router.push('/');
    // }, [walletAddr]);

    useEffect(() => {
        if (walletAddr) getTokens();
    }, [walletAddr]);

    return (
        <React.Fragment>
            <Head>
                <title>My Collection - Fathom Yacht Club</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
    
            <main className="sm:pt-20">
                <section className="bg-background-light pt-16 sm:mt-1 pb-16">
                    <div className="container w-4/5">
                        <h1 className="text-primary text-center font-bold font-muli text-5xl sm:text-6xl py-6">My Collection</h1>
                    </div>
                </section>

                {
                    loading ? (
                        <React.Fragment>
                            <div className="container flex items-center justify-center p-28">
                                <span className="block animate-spin bg-transparent border-3 border-t-primary rounded-full h-10 w-10"></span>
                            </div>
                        </React.Fragment>
                    ) : (
                        <section>
                            <Collection tokens={myTokens} onTokenClick={onTokenClick} />
                        </section>
                    ) 
                }
            </main>
        </React.Fragment>
    );
};