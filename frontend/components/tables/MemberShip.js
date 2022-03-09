import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import WalletConnector from '../modals/WalletConnector';

export default function MemberShip({ memberShips }) {
    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
      setIsOpen(false);
    }
  
    function openModal() {
      setIsOpen(true);
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
                                    <div className="grid grid-cols-2 sm:grid-cols-1">
                                        <div className="flex sm:hidden bg-background-secondary mb-0.5 items-center justify-center py-4 px-2 text-center">&nbsp;</div>
                                        <div className="mb-0.5 flex items-center justify-center h-auto py-4 px-2 text-center">
                                            <button className="uppercase bg-gradient-to-br from-background-primary to-background-secondary text-17px text-white py-3 px-9 rounded-full font-pop font-semibold">Buy now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className="p-4 text-center mt-8">
                <button className="rounded-full text-xl py-4 px-12 bg-background-primary text-white font-semibold" onClick={openModal}>Connect Wallet To Begin</button>
            </div>

            <WalletConnector isOpen={isOpen} closeModal={closeModal} />
        </div>
    );
};