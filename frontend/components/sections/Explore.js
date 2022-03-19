import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Explore({ tokens, onTokenClick }) {
    return (
        <div className="container w-4/5 py-16">
            {
                tokens.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        tokens.map((token, index) => {
                            return (
                                <div className="border border-gray-300 rounded-md flex items-center justify-center cursor-pointer overflow-hidden" key={index} onClick={() => onTokenClick(token.tokenId)}>
                                    <div className="relative">
                                        {
                                            token.leasable && <div className="absolute -left-12 top-4 z-10">
                                                <div className="bg-green-600 py-2 px-2 text-white uppercase text-center w-40 -rotate-45 text-sm shadow-md">
                                                    Leasable
                                                </div>
                                            </div>
                                        }
                                        {
                                            token.leased && <div className="absolute -left-12 top-4 z-10">
                                                <div className="bg-red-600 py-2 px-2 text-white uppercase text-center w-40 -rotate-45 text-sm shadow-md">
                                                    Leased
                                                </div>
                                            </div>
                                        }

                                        <div className="image-block responsive">
                                            <Image src={token.image} width="320" height="320" className="w-full !border-solid !border-x-0 !border-t-0 !border-b !border-gray-300" layout="fixed" alt={token.membership} />
                                        </div>
                                        <div className="py-2">
                                            <div className="px-4">
                                                <h4 className="font-normal text-base text-copy-secondary">{token.name}</h4>
                                            </div>
                                            <div className="px-4">
                                                <h4 className="font-medium text-sm text-copy-dark">#{token.tokenId}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                ) : (
                    <div className="p-8">
                        <h3 className="text-center text-3xl font-medium">No items found</h3>
                        <div className="flex items-center justify-center py-4 mt-4">
                            <Link href="/explore">
                                <a className="py-2 px-8 bg-primary text-xl text-white rounded-md w-auto">Explore</a>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    );
};