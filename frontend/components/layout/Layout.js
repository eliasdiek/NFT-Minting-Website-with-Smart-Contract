import React from 'react';
import Header from './Header';
import Footer from './Footer';

const headerMenu = [
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

const footerMenu = [
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
        title: 'Contact',
        link: '/contact',
        active: false
    }
];

export default function Layout(props) {
    return (
        <React.Fragment>
            <header className="w-full shadow-sm shadow-shadow sm:fixed top-0 bg-white z-20">
                <Header headerMenu={headerMenu} />
            </header>
            {props.children}
            <footer className="w-full bg-background-dark">
                <Footer footerMenu={footerMenu} />
            </footer>
        </React.Fragment>
    );
};