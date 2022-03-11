export const INIT = "INIT";
export const SET_WALLET_ADDRESS = "SET_WALLET_ADDRESS";
export const REMOVE_WALLET_ADDRESS = "REMOVE_WALLET_ADDRESS";

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

export {
	init,
	setWalletAddress,
	removeWalletAddress
};