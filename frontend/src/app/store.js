import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './reducers/mainSlice';
import { combineReducers } from 'redux';
import restaurantReducer from './reducers/restaurantSlice';
import customerReducer from './reducers/customerSlice';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
};

const reducers = combineReducers({
    mainReducer: mainReducer,
    restaurantReducer,
    customerReducer,
  });

const persistedReducer = persistReducer(persistConfig, reducers);
  
// 

export default configureStore({
    reducer: persistedReducer,

})