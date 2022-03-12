export const INIT = "INIT";
export const SET_WALLET_ADDRESS = "SET_WALLET_ADDRESS";
export const REMOVE_WALLET_ADDRESS = "REMOVE_WALLET_ADDRESS";
export const SET_WALLET_ID = "SET_WALLET_ID";

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

export {
	init,
	setWalletAddress,
	removeWalletAddress,
	setWalletId
};