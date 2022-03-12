import produce from "immer";
import {
	INIT,
    SET_WALLET_ADDRESS,
    REMOVE_WALLET_ADDRESS,
    SET_WALLET_ID,
    ADD_TO_CART,
    REMOVE_CART_ITEM
} from "../actions";

const initialState = {
	address: '',
    walletId: 0,
    cart: []
};

const mainReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT:
            const walletAddress = localStorage.getItem('address') ? localStorage.getItem('address') : '';
            const walletId = localStorage.getItem('id') ? localStorage.getItem('id') : '';
            const savedCart = localStorage.getItem('cart') ? JSON.parse((localStorage.getItem('cart'))) : [];

            console.log('[walletAddress]', walletAddress);

            return {
                ...state,
                address: walletAddress,
                walletId: walletId,
                cart: savedCart
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
        case ADD_TO_CART:
            const cartItem = {
                membership: action.membership,
                qty: action.qty,
                price: action.price
            };
            let myCart = state.cart;
            let itemExistsIndex;
            const itemExists = myCart.find(
                (item, index) => {
                    if (item.membership === cartItem.membership) {
                        itemExistsIndex = index;
                        return true;
                    }
                    else return false;
                }
            );

            if (itemExists) {
                myCart = produce(myCart, (draftCart) => {
                    draftCart[itemExistsIndex].qty += cartItem.qty
                });
            }
            else {
                myCart = produce(state.cart, (draftCart) => {
                    draftCart.push(cartItem);
                });
            }

            localStorage.setItem('cart', JSON.stringify(myCart));

            return {
                ...state,
                cart: myCart
            }
        case REMOVE_CART_ITEM:
            const cartToRemove = produce(state.cart, (draftCart) => {
                draftCart.splice(action.index, 1);
            });

            localStorage.setItem('cart', JSON.stringify(cartToRemove));

            return {
                ...state,
                cart: cartToRemove
            }
        default:
            return state;
    }
};

export default mainReducer;