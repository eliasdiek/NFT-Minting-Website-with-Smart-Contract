export const INIT = "INIT";
export const SET_WALLET_ADDRESS = "SET_WALLET_ADDRESS";
export const REMOVE_WALLET_ADDRESS = "REMOVE_WALLET_ADDRESS";
export const SET_WALLET_ID = "SET_WALLET_ID";
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_CART_ITEM = "REMOVE_CART_ITEM";

const init = () => {
	return {
		type: INIT
	};
};

const setWalletAddress = (address) => {
	return {
		type: SET_WALLET_ADDRESS,
		address: address
	};
};

const removeWalletAddress = () => {
	return {
		type: REMOVE_WALLET_ADDRESS
	};
};

const setWalletId = (id) => {
	return {
		type: SET_WALLET_ID,
		id: id
	}
}

const addToCart = (membership, qty, price) => {
	return {
		type: ADD_TO_CART,
		membership: membership,
		qty: qty,
		price: price
	}
}

const removeCartItem = (index) => {
	return {
		type: REMOVE_CART_ITEM,
		index: index
	}
}

export {
	init,
	setWalletAddress,
	removeWalletAddress,
	setWalletId,
	addToCart,
	removeCartItem
};