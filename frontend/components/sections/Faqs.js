import React, { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

const initialFaqs = [
    {
        title: "Tokens",
        items: [
            {
                q: 'What is a non-fungible token?',
                a: '<p>A non-fungible token is a unique and non-interchangeable unit of data stored on a digital ledger. NFTs can be used to represent easily-reproducible items such as photos, videos, audio, and other types of digital files as unique items, and use blockchain technology to establish a verified and public proof of ownership.</p>'
            },
            {
                q: 'How many types of tokens are there?',
                a: '<p>There are three types of tokens; power, yacht and prestige</p>'
            },
            {
                q: 'Do all tokens come with the same utility?',
                a: '<p>Power tokens give you access to 36ft to 50ft boats. Yacht tokens give you access to 36ftto 60ft boats. Prestige tokens give you access to 36ft to 70ft boats.</p>'
            },
            {
                q: 'Can a person purchase more than one token?',
                a: '<p>There is no limit on the number of tokens one can purchase.</p>'
            },
            {
                q: 'How many tokens can a person mint at once?',
                a: '<p>A person can mint two tokens at once, with no limit on the number of tokens one can purchase if they’d like to repeat the process over and over.</p>'
            }
        ]
    },
    {
        title: 'Membership',
        items: [
            {
                q: 'Is there an age requirement to be a token holder?',
                a: '<p>Yes, all token holders must be at least 21 years of age.</p>'
            },
            {
                q: 'How long is my membership valid for?',
                a: '<p>Your membership will remain valid as long as you are a token holder.</p>'
            },
            {
                q: 'Can a family member use the token instead of the actual token holder?',
                a: '<p>Unfortunately, not. The token is intended for the person that purchased it. A family member can enjoy the restaurant with the token holder, but not in place of the token holder.</p>'
            },
            {
                q: "If one doesn't intend to use the token, should they buy the token?",
                a: '<p>Since we have created a leasing mechanism where a token holder can “lease” their token to a non-token holder on a monthly basis, there is a potential “passive income strategy” that could exist here, in addition to the potential appreciation of the token price due to the scarcity and demand of the token. That being said, we encourage all token holders to enjoy the restaurant, as this is how the tokens were conceptualized, as our project is focused on utility.</p>'
            },
            {
                q: "Can I lease my token to someone else if I can't use it for a month?",
                a: '<p>Yes, you can lease your token on the secondary market for someone else to enjoy.</p>'
            },
            {
                q: "If I sell my token are there fees associated with the transaction?",
                a: '<p>Yes, all secondary sales are subject to transaction fees and 10% to Fathom Yacht Club, both of which are paid by the seller.</p>'
            },
            {
                q: 'What does my token pay for?',
                a: '<p>Your token gives you membership and exclusive experiences. <br />All yacht charter costs are additional and not included. Some events may require additional surcharges.</p>'
            },
            {
                q: "If I don't want to be a member any longer, can I sell my token? If so, how?",
                a: '<p>You can sell your token on the secondary market (i.e: Opensea.io)</p>'
            },
            {
                q: 'When can I start chartering boats?',
                a: '<p>We are anticipating a Q3 2022.</p>'
            },
            {
                q: 'What will FYC use the proceed sales for?',
                a: '<p>The proceeds, net of taxes, will be used to fund club operations, including, but not limited to… </p>\
                <p>Project development and operational leadership, including, financial and acquisition planning</p>\
                <ul>\
                    <li>Product & engineering</li>\
                    <li>Infrastructure setup and fees</li>\
                    <li>Legal, compliance, and accounting</li>\
                    <li>Marketing, partnerships and sales</li>\
                    <li>Community development</li>\
                    <li>Acquisition of assets including yachts.</li>\
                    <li>Further initiatives</li>\
                </ul>'
            }
        ]
    },
    {
        title: 'Reservations',
        items: [
            {
                q: 'Will non member have access to the boats?',
                a: '<p>Nonmembers will not have access to the boats unless they are with a member.</p>'
            },
            {
                q: 'As a token holder, are boat reservations required?',
                a: '<p>Reservations are made on a first-come, first-serve basis to all token holders. You do need a reservation when chartering any of the boats.</p>'
            },
            {
                q: 'How far in advance can I make a reservation?',
                a: '<p>You can make your reservation up to 365 days in advance of the date you’d like to visit.</p>'
            },
            {
                q: "Can I lease my token to someone else if I can't use it for a month?",
                a: '<p>Yes, you can lease your token on the secondary market for someone else to enjoy.</p>'
            },
            {
                q: 'How many guests can I bring?',
                a: '<p><b>For yacht charters, the number of passengers will vary by boat and jurisdiction.</b></p>\
                <p><b>For Member Events Token Holders as allocated per membership level</b></p>\
                <ul>\
                    <li>Power token holders can bring up to 4 guests to member events.</li>\
                    <li>Yacht token holders can bring up to 6 guests to member events.</li>\
                    <li>Prestige token holders can bring up to 8 guests to member events.</li>\
                </ul>'
            },
            {
                q: 'Can I gift or make a reservation for someone else to enjoy the token?',
                a: '<p>Unfortunately, not. All token holders must be present with their guests to enjoy the membership benefits.</p>'
            },
            {
                q: 'Can I cancel a charter reservation?',
                a: '<p>Cancellations will be considered as per charter agreement</p>'
            }
        ]
    }
]

export default function Faqs() {
    const [faqs, setFaqs] = useState([]);
    const [update, setUpdate] = useState(0);

    function accordion(title, index) {
        setFaqs(initialFaqs.map(faq => {
            faq.items = faq.items.map((item, i) => {
                if (faq.title == title) item.open = false;
                if (faq.title == title && index == i) {
                    item.open = true;
                }

                return item;
            });

            return faq;
        }));

        setUpdate(update + 1);
    }

    useEffect(() => {
        setFaqs(initialFaqs.map(faq => {
                faq.items = faq.items.map(item => {
                    item.open = false;
                    return item;
                });

                return faq;
            }
        ));
    }, []);

    return (
        <div className="container py-4">
            <h2 className="font-abel font-semibold text-6xl text-center text-primary mb-4">FAQs</h2>
            {
                faqs.map(faq => {
                    return (
                        <div className="mb-8" key={faq.title}>
                            <h3 className="mb-4 font-abel text-4xxl text-primary">{ faq.title }</h3>
                            {
                                faq.items.map((item, index) => {
                                    return (
                                        <div className="mb-4" key={index}>
                                            <h4>
                                                <button
                                                 type="button"
                                                 className="flex justify-between items-center p-5 w-full font-medium text-left text-gray-900 bg-gray-100 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                 onClick={() => accordion(faq.title, index)}
                                                 datavalue={update}
                                                >
                                                    <div className="text-lg font-medium text-copy-dark">{ item.q }</div>
                                                    <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                    </svg>
                                                </button>
                                            </h4>
                                            <Transition
                                                enter="transform transition-all ease-in-out duration-500"
                                                enterFrom="max-h-0 overflow-hidden"
                                                enterTo="max-h-screen overflow-hidden"
                                                leave="transform transition-all ease-in-out duration-500"
                                                leaveFrom="max-h-screen overflow-hidden"
                                                leaveTo="max-h-0 overflow-hidden"
                                                show={item.open}
                                                as={Fragment}
                                            >
                                                <div className="faq-item-body text-copy-darker text-lg font-medium">
                                                    <div className="p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900" dangerouslySetInnerHTML={{ __html: item.a }}></div>
                                                </div>
                                            </Transition>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    );
};