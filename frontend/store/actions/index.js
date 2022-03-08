export const STATUS_UPDATE = "STATUS_UPDATE";

export const statusUpdate = (status) => {
	return {
		type: STATUS_UPDATE,
		status: status,
	};
};