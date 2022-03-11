import {
	INIT,
    SET_WALLET_ADDRESS,
    REMOVE_WALLET_ADDRESS
} from "../actions";

const initialState = {
	address: ''
};

const mainReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT:
            const walletAddress = localStorage.getItem('address') ? localStorage.getItem('address') : '';

            console.log('[walletAddress]', walletAddress);

            return {
                ...state,
                address: walletAddress
            };
        case SET_WALLET_ADDRESS:
            const address = action.address;
            localStorage.setItem('address', address);

            return {
                ...state,
                address: address
            }
        case REMOVE_WALLET_ADDRESS:
            localStorage.removeItem('address');

            return {
                ...state,
                address: ''
            }
        default:
            return state;
    }
};

export default mainReducer;