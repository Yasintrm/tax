import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import magazineReducer from '../features/csvTable/csvTableSlice';


//Application redux store
export const store = configureStore({
  reducer: {
    csv: magazineReducer
  },
});

export default store;