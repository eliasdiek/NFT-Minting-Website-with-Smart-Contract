import React from 'react';
import Image from 'next/image';
import { Ether } from '../icons';
import Button from '../buttons/Button';

const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const tokenBatchURI = process.env.NEXT_PUBLIC_TOKEN_BATCH_URI;

function truncate(string) {
    const input = String(string);
    return input.substr(0, 6) + '...' + input.substr(input.length - 4);
}

export default function TokenDetail({ metaData, leaseHandler }) {
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
                        <div className="image-block responsive">
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
                        <div className="px-4 py-8 bg-background-light">
                            <div className="text-sm">No offers yet</div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 md:top-20 md:bottom-auto border-y border-gray-300 w-full bg-background-light z-10">
                    <div className="container flex items-center justify-center md:justify-end py-2 md:px-16">
                        <Button
                            theme="primary"
                            className="w-auto capitalize !py-2"
                            onClick={() => leaseHandler(metaData.tokenId)}
                        >
                            Lease
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};