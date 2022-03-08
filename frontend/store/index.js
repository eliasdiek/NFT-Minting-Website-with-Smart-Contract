import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './reducers';

export default configureStore({
  reducer: {
    mainReducer: mainReducer
  },
});