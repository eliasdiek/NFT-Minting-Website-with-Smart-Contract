import Image from 'next/image';
import Link from 'next/link';

export default function Footer({ footerMenu }) {
    return (
        <div className="container w-4/5 py-16">
            <div className="block sm:flex items-start justify-between">
                <div className="flex items-center justify-center mb-8 sm:mb-0">
                    <Image src="/images/fathom-yacht-club-logo-vertical-sm-white-400.png" alt="Fathom Yacht Club Logo" width={145} height={82} />
                </div>
                <div className="footer-links">
                    <ul>
                        {
                            footerMenu.map((menu, index) => {
                                return (
                                    <li className="py-2" key={index}>
                                        <Link href={menu.link}>
                                            <a className='text-white font-light text-lg'>{menu.title}</a>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <p className="text-white mt-8 text-lg">Copyright (c)2022 All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};