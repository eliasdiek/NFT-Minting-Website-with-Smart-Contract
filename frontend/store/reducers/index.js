import {
	INIT,
    SET_WALLET_ADDRESS,
    REMOVE_WALLET_ADDRESS,
    SET_WALLET_ID
} from "../actions";

const initialState = {
	address: '',
    walletId: 0
};

const mainReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT:
            const walletAddress = localStorage.getItem('address') ? localStorage.getItem('address') : '';
            const walletId = localStorage.getItem('id') ? localStorage.getItem('id') : '';

            console.log('[walletAddress]', walletAddress);

            return {
                ...state,
                address: walletAddress,
                walletId: walletId
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
        case SET_WALLET_ID:
            localStorage.setItem('id', action.id);

            return {
                ...state,
                walletId: action.id
            }
        default:
            return state;
    }
};

export default mainReducer;