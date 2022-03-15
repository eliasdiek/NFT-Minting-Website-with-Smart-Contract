import React, {Fragment, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';
import ClickAwayListener from 'react-click-away-listener';

export default function Header({ headerMenu }) {
    const [menu, setMenu] = useState(headerMenu);
    const [showMenu, setShowMenu] = useState(true);
    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();

    function toggleMenu() {
        setShowMenu(true);
        setOpenMenu(!openMenu);
    }

	const handleClickAway = () => {
        const width = window.innerWidth;

        if (width < 768) {
            setShowMenu(true);
            setOpenMenu(false);
        }
	};

    useEffect(() => {
        setOpenMenu(false);

        setMenu(headerMenu.map(menu => {
            if (menu.link === router.pathname) menu.active = true;
            else menu.active = false;

            return menu;
        }));

        const width = window.innerWidth;

        if (width > 768) {
            setOpenMenu(true);
        }
    }, [router, headerMenu]);

    return (
        <div className="sm:container px-8 sm:px-4">
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
                            <div className="w-5 h-0.5 bg-primary"></div>
                            <div className="w-5 h-0.5 bg-primary"></div>
                            <div className="w-5 h-0.5 bg-primary"></div>
                        </div>
                    </button>
                </div>

                <Transition
                    enter={`transform transition transition-all sm:transition-none ease-in-out duration-700 sm:duration-0 ${!showMenu && 'transition-none'}`}
                    enterFrom="max-h-0 overflow-hidden"
                    enterTo="max-h-screen overflow-hidden"
                    leave={`transform transition transition-all sm:transition-none ease-out duration-500 sm:duration-0 ${!showMenu && 'transition-none'}`}
                    leaveFrom="max-h-screen overflow-hidden"
                    leaveTo="max-h-0 overflow-hidden"
                    show={openMenu}
                    as={Fragment}
                >
                    <div className='sm:block absolute sm:relative top-20 sm:top-0 z-10 sm:p-0 w-full sm:w-auto shadow-md sm:shadow-none bg-white'>
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <ul className="block sm:flex items-center m-0 p-0 px-4 pt-8 sm:pt-0 pb-4 sm:pb-0 text-base font-bold mx-auto bg-white border-t-3 border-primary sm:border-none">
                                {
                                    menu.map(item => {
                                        return (
                                            <li className={`pr-6 px-4 py-3 border-b sm:border-none border-gray-100 text-sm sm:text-base`} key={item.title}>
                                                <Link href={item.link}>
                                                    <a className={`${item.active ? 'text-primary' : 'text-copy-overlay'}`} onClick={() => setShowMenu(false)}>{item.title}</a>
                                                </Link>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </ClickAwayListener>
                    </div>    
                </Transition>

                <div>
                    <Image src="/images/default.png" className="w-1/2 sm:w-full" alt="Profile picture" width={30} height={30} />
                </div>
            </div>
        </div>
    );
};