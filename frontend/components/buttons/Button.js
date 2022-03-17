import React from 'react';

export default function Button(props) {

    return (
        <button
         {...props}
         className={`text-white py-3 px-9 border-2 ${ props.theme === 'primary' && 'from-background-primary to-background-secondary bg-gradient-to-br'} ${props.theme === 'secondary' && 'bg-primary' } ${props.theme === 'tertiary' && 'bg-transparent border-primary border-2 !text-primary' } w-full uppercase text-17px rounded-full font-pop font-semibold flex items-center justify-center ${props.className ? props.className : ''}`}
        >
            {props.children}
        </button>
    );
};