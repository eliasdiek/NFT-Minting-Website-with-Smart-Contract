import React from 'react';
import Image from 'next/image';

export default function Collection({ tokens, onTokenClick }) {
    return (
        <div className="container w-4/5 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    tokens.map((token, index) => {
                        return (
                            <div className="border border-gray-300 rounded-md flex items-center justify-center cursor-pointer" key={index} onClick={() => onTokenClick(token.tokenId)}>
                                <div>
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
        </div>
    );
};