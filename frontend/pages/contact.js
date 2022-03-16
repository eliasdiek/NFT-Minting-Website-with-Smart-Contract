import React from 'react';
import Head from 'next/head';
import Button from '../components/buttons/Button';

export default function Contact() {
    return (
        <React.Fragment>
            <Head>
                <title>Contact - Fathom Yacht Club</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
    
            <main className="sm:pt-20">
                <section className="bg-background-light pt-16 sm:mt-1 pb-16">
                    <div className="container max-w-screen-sm">
                        <h1 className="text-primary text-center font-bold font-muli text-5xl sm:text-6xl py-6">Contact</h1>

                        <div className="px-4 sm:px-2 py-4">
                            <div className="my-6">
                                <label htmlFor="name" className="text-base font-bold text-copy-darker">Name</label>
                                <input type="text" id="name" name="name" className="w-full border border-gray-400 outline-none py-1 px-2 mt-3" />
                            </div>
                            <div className="my-6">
                                <label htmlFor="email" className="text-base font-bold text-copy-darker">Email</label>
                                <input type="email" id="email" name="email" className="w-full border border-gray-400 outline-none py-1 px-2 mt-3" />
                            </div>
                            <div className="my-6">
                                <label htmlFor="message" className="text-base font-bold text-copy-darker">Message</label>
                                <textarea type="message" id="message" name="message" className="w-full border border-gray-400 outline-none py-1 px-2 mt-3 h-72"></textarea>
                            </div>
                            <div className="my-6">
                                <Button theme="secondary" className="text-xl py-2 px-6 w-auto capitalize font-thin">
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </React.Fragment>
    );
};