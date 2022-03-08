import React, {useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

const initialMenu = [
    {
        title: 'Home',
        link: '/',
        active: true
    },
    {
        title: 'About',
        link: '/about',
        active: false
    },
    {
        title: 'Locations',
        link: '/locations',
        active: false
    },
    {
        title: 'Contact',
        link: '/contact',
        active: false
    }
];

export default function Header() {
    const [menu, setMenu] = useState(initialMenu);
    const router = useRouter();

    useEffect(() => {
        console.log('[router]', router);
        setMenu(initialMenu.map(menu => {
            if (menu.link === router.pathname) menu.active = true;
            else menu.active = false;

            return menu;
        }));
    }, []);

    return (
        <div className="container py-2 px-8">
            <div className="flex items-center justify-between">
                <div className="logo-wrapper">
                    <Link href="/">
                        <a className="logo">
                            <Image src="/images/logo.svg" alt="Fathom Yacht Club Logo" width={503} height={59} />
                        </a>
                    </Link>
                </div>
                <div className='header-links'>
                    <ul className="flex items-center m-0 p-0 text-base font-bold">
                        {
                            menu.map(item => {
                                return (
                                    <li className={`pr-6`} key={item.title}>
                                        <Link href={item.link}>
                                            <a className={`${item.active ? 'text-primary' : 'text-copy-overlay'}`}>{item.title}</a>
                                        </Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};