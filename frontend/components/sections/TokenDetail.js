import React from 'react';
import Image from 'next/image';
import { Ether, Wether } from '../icons';
import Button from '../buttons/Button';

const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const tokenBatchURI = process.env.NEXT_PUBLIC_TOKEN_BATCH_URI;

function truncate(string) {
    const input = String(string);
    return input.substr(0, 6) + '...' + input.substr(input?.length - 4);
}

export default function TokenDetail({
    walletAddr,
    metaData,
    openLeaseModal,
    tokenIsLeasable,
    cancelTokenLeasable,
    leasableToken,
    isOwner,
    offers,
    approveOffer,
    cancelOffer,
    lease,
    leaseHandler,
    btnLoading
}) {
    return (
        <div className="container p-4 md:p-8">
            <div className="block md:flex md:pt-12 relative">
                <div className="w-full md:w-96">
                    <div className="flex md:hidden items-center justify-between py-4">
                        <h2 className="text-3xl font-semibold text-copy-primary">{ metaData.name }</h2>
                    </div>
                    <div className="rounded-md border borer-gray-300 overflow-hidden">
                        <div className="flex items-center justify-between p-2">
                            <Ether />
                        </div>
                        <div className="image-block responsive md:min-w-96">
                            <Image src={metaData.image} width="384" height="384" layout="fixed" className="!w-fill" alt={metaData.name} />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md my-4">
                        <div className="px-4 py-4 border-b borer-gray-300 font-medium">Description</div>
                        <div className="px-4 py-8 bg-background-light">
                            <p className="text-copy-secondary text-sm py-2">Created by you</p>
                            { metaData?.description && <div className="text-copy-secondary text-sm py-2">{metaData?.description}</div> }
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md my-4">
                        <div className="px-4 py-4 border-b borer-gray-300 font-medium">Properties</div>
                        <div className="px-4 py-8 bg-background-light">
                            <div className="grid grid-cols-3">
                            {
                                metaData.attributes.map((attr, index) => {
                                    return (
                                        <div className="border border-green-overlay text-center p-4 text-xs rounded-md bg-blue-100 m-3px whitespace-nowrap" key={index}>
                                            <div className="text-blue-600 mb-2 text-ellipsis uppercase">{ attr.trait_type }</div>
                                            <div className="text-sm text-ellipsis overflow-hidden font-medium" title={attr.value}>{ attr.value }</div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:p-8 w-full block sm:block">
                    <div className="hidden md:flex items-center justify-between">
                        <h2 className="text-3xl font-semibold text-copy-primary">{ metaData.name }</h2>
                    </div>

                    { (tokenIsLeasable && leasableToken) && <div className="bg-white border border-gray-300 rounded-md my-4">
                        <div className="px-4 py-4 border-b borer-gray-300 font-medium">Leasable for { leasableToken.duration } days</div>
                        <div className="px-4 py-8 bg-background-light">
                            <div className="py-2 text-sm">
                                <div className="flex flex-col items-start justify-start">
                                    <div className="text-lg text-copy-secondary ">Current price</div>
                                    <div className="flex items-center py-2">
                                        <Ether width="20" height="20" fill="#333" />
                                        <span className="text-3xl font-medium ml-1">{ leasableToken.price }</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-start">
                                    <Button
                                     theme="secondary"
                                     className={`capitalize w-auto ${isOwner || btnLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-1'}`}
                                     disabled={isOwner || btnLoading ? true : false}
                                     onClick={leaseHandler}
                                    >
                                        {
                                            btnLoading ? 
                                            <span className="block animate-spin bg-transparent border-3 border-b-white border-t-blue-400 rounded-full h-5 w-5"></span> : 
                                            <span>Lease Now</span> 
                                        }
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div> }

                    {
                        lease?.price > 0 && <div className="bg-white border border-gray-300 rounded-md my-4">
                            <div className="px-4 py-4 border-b borer-gray-300 font-medium">Lease status</div>
                            <div className="px-4 py-8 bg-background-light">
                                <div className="flex items-center justify-between py-2 text-sm">
                                    <div>Leased by</div>
                                    <div className="text-primary">
                                        <a href={`https://rinkeby.etherscan.io/address/${lease.from}`} target="_blank" rel="noreferrer" title={lease.from}>
                                            { truncate(lease.from) }
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 text-sm">
                                    <div>Leasing at</div>
                                    <div className="">
                                        { lease.price } ETH
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 text-sm">
                                    <div>Expires in</div>
                                    <div className="">
                                        { lease.expiresIn } days
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="bg-white border border-gray-300 rounded-md my-4">
                        <div className="px-4 py-4 border-b borer-gray-300 font-medium">Detail</div>
                        <div className="px-4 py-8 bg-background-light">
                            <div className="flex items-center justify-between py-2 text-sm">
                                <div>Contract Address</div>
                                <div className="text-primary">
                                    <a href={`https://rinkeby.etherscan.io/address/${nftContractAddress}`} target="_blank" rel="noreferrer" title={nftContractAddress}>
                                        { truncate(nftContractAddress) }
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 text-sm">
                                <div>Token ID</div>
                                <div className="text-primary">
                                    <a href={`${tokenBatchURI}/${metaData.tokenId}`} target="_blank" rel="noreferrer">{ metaData.tokenId }</a>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 text-sm">
                                <div>Token Standard</div>
                                <div className="">ERC-721</div>
                            </div>
                            <div className="flex items-center justify-between py-2 text-sm">
                                <div>Blockchain</div>
                                <div className="">Rinkeby</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md my-4">
                        <div className="px-4 py-4 border-b borer-gray-300 font-medium">Offers</div>
                        {
                            offers?.length ? (
                                <div className="px-4 py-8 bg-background-light">
                                    {
                                        offers.map((offer, index) => {
                                            return (
                                                <div key={index} className="py-2 border-b border-gray-200 flex items-center">
                                                    <div className="text-center text-sm flex items-center w-36 shrink">
                                                        <Wether width="15" height="20" />
                                                        <div className="ml-2">
                                                            <span className="font-bold">{ offer['price'] }</span> WETH
                                                        </div>
                                                    </div>
                                                    <div className="text-center text-sm w-16 shrink">{ offer['expiresIn'] } days</div>
                                                    <div className="text-center text-sm w-36 shrink grow text-primary">
                                                        <a href={`https://rinkeby.etherscan.io/address/${offer['from']}`} title={offer['from']} target="_blank" rel="noreferrer">
                                                            { truncate(offer['from']) }
                                                        </a>
                                                    </div>
                                                    {
                                                        
                                                        isOwner && <div className="flex items-center justify-end shrink grow text-xs">
                                                            <button
                                                                className="bg-white rounded-md border border-primary py-1 px-4 ml-2"
                                                                onClick={() => approveOffer(offer['from'])}
                                                            >
                                                                Accept
                                                            </button>
                                                        </div>
                                                    }
                                                    {
                                                            offer['from'] == walletAddr &&  <div className="flex items-center justify-end shrink grow text-xs">
                                                                <button
                                                                    className="bg-white rounded-md border border-primary py-1 px-4 ml-2"
                                                                    onClick={() => cancelOffer(offer['from'])}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <div className="px-4 py-8 bg-background-light">
                                    <div className="text-sm">No offers yet</div>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 md:top-20 md:bottom-auto border-y border-gray-300 w-full bg-background-light z-10">
                    {
                        isOwner ? (tokenIsLeasable ? (
                            <div className="container flex items-center justify-center md:justify-end py-2 md:px-16">
                                <Button
                                    theme="tertiary"
                                    className={`w-auto capitalize !py-2 ${lease?.price > 0 && 'cursor-not-allowed opacity-50'}`}
                                    onClick={() => cancelTokenLeasable()}
                                    disabled={lease?.price > 0 ? true : false}
                                >
                                    Cancel listing
                                </Button>
                                <Button
                                    theme="secondary"
                                    className={`w-auto capitalize !py-2 border-primary ml-4 ${lease?.price > 0 && 'cursor-not-allowed opacity-50'}`}
                                    onClick={() => openLeaseModal(metaData.tokenId)}
                                    disabled={lease?.price > 0 ? true : false}
                                >
                                    Lower price
                                </Button>
                            </div>
                        ) : (
                            <div className="container flex items-center justify-center md:justify-end py-2 md:px-16">
                                <Button
                                    theme="primary"
                                    className={`w-auto capitalize !py-2 ${lease?.price > 0 && 'cursor-not-allowed opacity-50'}`}
                                    onClick={() => openLeaseModal(metaData.tokenId)}
                                    disabled={lease?.price > 0 ? true : false}
                                >
                                    Set lease
                                </Button>
                            </div>
                        )) : (
                            <div className="container flex items-center justify-center md:justify-end py-2 md:px-16">
                                <Button
                                    theme="primary"
                                    className={`w-auto capitalize !py-2 ${lease?.price > 0 && 'cursor-not-allowed opacity-50'}`}
                                    onClick={() => openLeaseModal(metaData.tokenId)}
                                    disabled={lease?.price > 0 ? true : false}
                                >
                                    Make offer
                                </Button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};