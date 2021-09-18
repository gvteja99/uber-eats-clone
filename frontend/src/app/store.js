import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './reducers/mainSlice'
import restaurantReducer from './reducers/restaurantSlice';
import customerReducer from './reducers/customerSlice';
// 

export default configureStore({
    reducer: {
        mainReducer,
        restaurantReducer,
        customerReducer,
    }

})