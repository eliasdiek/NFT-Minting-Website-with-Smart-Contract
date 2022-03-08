import {
	STATUS_UPDATE,
} from "../actions";

const initialState = {
	status: [],
};

const mainReducer = (state = initialState, action) => {
    switch(action.type) {
        case STATUS_UPDATE:
            const nextState = action.status;

            return {
                ...state,
                status: nextState
            };
        default:
            return state;
    }
};

export default mainReducer;