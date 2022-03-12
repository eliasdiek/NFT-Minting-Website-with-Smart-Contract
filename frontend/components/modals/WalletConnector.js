import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Wallet, Times } from '../icons';


export default function WalletConnector({ isOpen, closeModal, wallets, activate, onSetWalletId }) {
    const [openLearn, setOpenLearn] = useState(false);

    async function onWalletSelect(action, index) {
        try {
            await activate(action);
        }
        catch(err) {
            console.log('[wallet connector]', err);
        }

        onSetWalletId(index);
    }

    return (
        <Fragment>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 overflow-y-auto bg-background-overlay z-50"
                    onClose={closeModal}
                >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                    <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                    >
                    &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title as="div" className="flex items-center justify-between">
                                <div className="flex">
                                    <div className="rounded-full p-2 bg-gray-200">
                                        <Wallet />
                                    </div>
                                    <h4 className="text-xxl ml-2">Select a wallet</h4>
                                </div>
                                <div>
                                    <button className="rounded-full p-2 hover:bg-gray-200" onClick={closeModal}>
                                        <Times />
                                    </button>
                                </div>
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Please select a wallet to continue</p>
                            </div>

                            <div className="p-4">
                                <ul className="w-full">
                                    {
                                        wallets.map((wallet, index) => {
                                            return (
                                                <li className="w-full py-4" key={index}>
                                                    <button className="w-full flex items-center justify-center rounded-full card focus:ring-2 p-4" onClick={() => { onWalletSelect(wallet.action, index) }}>
                                                        <div className="mr-2">
                                                            { wallet.icon }
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-xl text-copy-dark">{ wallet.name }</span>
                                                        </div>
                                                    </button>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>

                            <div className="mt-4">
                                <button className="text-base font-normal text-primary" onClick={() => setOpenLearn(!openLearn)}>What is a wallet?</button>

                                <Transition
                                    enter={`transform transition transition-all ease-in-out duration-700`}
                                    enterFrom="max-h-0 overflow-hidden"
                                    enterTo="max-h-screen overflow-hidden"
                                    leave={`transform transition transition-all ease-out duration-500`}
                                    leaveFrom="max-h-screen overflow-hidden"
                                    leaveTo="max-h-0 overflow-hidden"
                                    show={openLearn}
                                    as={Fragment}
                                >
                                    <div className="py-2">
                                        <p className="text-sm text-copy-darker">Wallets are used to send, receive, and store digital assets like Ether. Wallets come in many forms. They are either built into your browser, an extension added to your browser, a piece of hardware plugged into your computer or even an app on your phone. For more information about wallets, see <a href="https://docs.ethhub.io/using-ethereum/wallets/intro-to-ethereum-wallets/" className="text-primary" target="_blank">this explanation</a>.</p>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
                </Dialog>
            </Transition>
        </Fragment>
    );
}
