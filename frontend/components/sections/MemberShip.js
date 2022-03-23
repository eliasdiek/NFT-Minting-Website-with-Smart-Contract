import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import WalletConnection from '../blocks/WalletConnection';
import Button from '../buttons/Button';
import { useSelector } from "react-redux";
import Web3 from 'web3';

export default function MemberShip({ memberShips }) {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const walletAddr = useSelector((state) => state.address);

    useEffect(() => {
        if (walletAddr) getBalance(walletAddr);
    }, [walletAddr]);

    function goToMemberShip(memberShip) {
        router.push(`/membership?membership=${memberShip}`);
    }

    async function getBalance(addr) {
        if (window == undefined) return false;

        const { ethereum } = window;
        if (!ethereum) return false;
        
        var web3 = new Web3(ethereum);
        const wei =  await web3.eth.getBalance(addr);
        const balance = web3.utils.fromWei(wei);

        setBalance(balance);
    }

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
                                            <Button
                                                className={`${walletAddr && balance > 0 ? 'opacity-1' : 'opacity-50 cursor-not-allowed'}`}
                                                theme="primary"
                                                disabled={walletAddr && balance > 0 ? false :  true}
                                                onClick={() => goToMemberShip(memberShip.name)}
                                            >
                                                Buy now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div>
                <WalletConnection />
            </div>
        </div>
    );
};