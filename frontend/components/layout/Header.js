import React, {Fragment, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';

export default function Header({ headerMenu }) {
    const [menu, setMenu] = useState(headerMenu);
    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();

    function toggleMenu() {
        setOpenMenu(!openMenu);
    }

    useEffect(() => {
        console.log('[router]', router);
        setMenu(headerMenu.map(menu => {
            if (menu.link === router.pathname) menu.active = true;
            else menu.active = false;

            return menu;
        }));

        const width = window.innerWidth;

        if (width > 768) setOpenMenu(true);
    }, []);

    return (
        <div className="sm:container px-8 sm:px-8">
            <div className="flex items-center justify-start sm:justify-between relative z-20 sm:py-1">
                <div className="relative z-20 py-7 sm:py-2 bg-white">
                    <Link href="/">
                        <a className="flex w-3/5 sm:w-full">
                            <Image src="/images/logo.svg" className="w-1/2 sm:w-full" alt="Fathom Yacht Club Logo" width={503} height={59} />
                        </a>
                    </Link>
                </div>
                <div className="absolute right-0 z-20 h-full flex items-center sm:hidden">
                    <button onClick={() => toggleMenu()}>
                        <div className="space-y-1">
                            <div className="w-6 h-0.5 bg-primary"></div>
                            <div className="w-6 h-0.5 bg-primary"></div>
                            <div className="w-6 h-0.5 bg-primary"></div>
                        </div>
                    </button>
                </div>
                <Transition
                    enter="transform transition ease-in-out duration-500 sm:duration-0"
                    enterFrom="-translate-y-full"
                    enterTo="translate-y-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-0"
                    leaveFrom="translate-y-0"
                    leaveTo="-translate-y-full"
                    show={openMenu}
                    as={Fragment}
                >
                    <div className='sm:block absolute sm:relative top-20 sm:top-0 px-4 pt-8 pb-4 z-10 sm:p-0 w-full sm:w-auto bg-white border-t-2 border-primary sm:border-none'>
                        <ul className="block sm:flex items-center m-0 p-0 text-base font-bold mx-auto">
                            {
                                menu.map(item => {
                                    return (
                                        <li className={`pr-6 px-4 py-3 border-b sm:border-none border-gray-100 text-sm sm:text-lg`} key={item.title}>
                                            <Link href={item.link}>
                                                <a className={`${item.active ? 'text-primary' : 'text-copy-overlay'}`}>{item.title}</a>
                                            </Link>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </Transition>
            </div>
        </div>
    );
};