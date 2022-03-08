import React from 'react';

export default function Newsletter() {
    return (
        <div className="bg-gradient-to-b from-background-primary to-background-secondary py-28">
            <div className="container sm:w-4/5">
                <div className="grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 my-1">
                    <div className="py-8 pl-8 pr-8 sm:pl-0 sm:pr-8">
                        <h3 className="font-muli font-semibold text-white text-4xl pb-4">Stay Informed</h3>
                        <p className="text-white text-xl font-light">Get the latest information about this NFT drop and updates about the project</p>
                    </div>
                    <div className="py-8 pl-8 pr-8 sm:pr-0 sm:pl-8">
                        <input type="text" className="rounded-md px-4 py-3 outline-none w-full mb-4" placeholder="Your Email Address" />
                        <button className="rounded-full text-xl py-1 px-8 bg-background-primary text-white font-normal">Join Mailing List</button>
                    </div>
                </div>
            </div>
        </div>
    );
};