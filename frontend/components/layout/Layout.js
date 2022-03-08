import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout(props) {
    return (
        <React.Fragment>
            <header className="w-full shadow-md fixed top-0 bg-white z-10">
                <Header />
            </header>
            {props.children}
            <footer className="w-full bg-gray-600">
                <Footer />
            </footer>
        </React.Fragment>
    );
};