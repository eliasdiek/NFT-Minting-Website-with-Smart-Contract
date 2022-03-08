import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className="container py-8 mt-8">
            <div className="flex items-start justify-between">
                <div className="footer-logo-wrapper">
                    <Image src="/images/fathom-yacht-club-logo-vertical-sm-white-400.png" alt="Fathom Yacht Club Logo" width={145} height={82} />
                </div>
                <div className="footer-links">
                    <ul>
                        <li className="py-2">
                            <Link href="/">
                                <a className='text-white'>Home</a>
                            </Link>
                        </li>
                        <li className="py-2">
                            <Link href="/about">
                                <a className='text-white'>About</a>
                            </Link>
                        </li>
                        <li className="py-2">
                            <Link href="/contact">
                                <a className='text-white'>Contact</a>
                            </Link>
                        </li>
                    </ul>

                    <p className="text-white mt-8">Copyright (c)2022 All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};