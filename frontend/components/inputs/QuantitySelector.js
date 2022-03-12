import React from 'react';

export default function QuantitySelector({ counter, increment, decrement, min, max }) {
    return (
        <div className="block">
            <div className="mb-4 text-xs uppercase text-center">Quantity:</div>
            <div className="flex items-center">
                <button className={`mx-4 rounded-full w-12 h-12 hover:bg-blue-100 focus:ring-4 text-3xl ${ counter == min && 'cursor-not-allowed opacity-50' }`} disabled={counter == min ? true :  false} onClick={decrement}>-</button>
                <span className="mx-2 text-3xl">{ counter }</span>
                <button className={`mx-4 rounded-full w-12 h-12 hover:bg-blue-100 focus:ring-4 text-3xl ${ counter == max && 'cursor-not-allowed opacity-50' }`} disabled={counter == max ? true :  false} onClick={increment}>+</button>
            </div>
        </div>
    );
};