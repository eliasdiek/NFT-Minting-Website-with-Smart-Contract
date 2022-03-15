import React from 'react';
import Image from 'next/image';

export default function Collection({ tokens }) {
    return (
        <div className="container w-4/5">
            <div className="grid grid-cols-3 gap-3">
                {
                    tokens.map((token, index) => {
                        <div className="border border-gray-300 rounded-md">
                            <div className="image-block">
                                <Image src={token.image} width="300" height="300" className="w-full" alt={token.membership} />
                            </div>
                            <div className="py-4">
                                <h4 className="font-normal text-base text-copy-secondary">{token.membership}</h4>
                            </div>
                            <div className="py-4">
                                <h4 className="font-normal text-base text-copy-dark">{token.id}</h4>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    );
};