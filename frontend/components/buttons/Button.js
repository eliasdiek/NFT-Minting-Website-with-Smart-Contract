import React from 'react';

export default function Button(props) {

    return (
        <button
         {...props}
         className={`${ props.theme === 'primary' && 'from-background-primary to-background-secondary bg-gradient-to-br'} ${props.theme === 'secondary' && 'bg-primary' } w-full uppercase text-17px text-white py-3 px-9 rounded-full font-pop font-semibold flex items-center justify-center ${props.className ? props.className : ''}`}
        >
            {props.children}
        </button>
    );
};