import { createStore, compose, applyMiddleware } from "redux";
import mainReducer from './reducers';

const composeEnhancers = typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	mainReducer,
	composeEnhancers(applyMiddleware())
);

export default store;