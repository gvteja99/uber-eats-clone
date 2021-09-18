import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCount } from './counterAPI';

const initialState = {
    resProfile: {},
    resMenu: [],
    resOrders: [],
};

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateResProfile: (state, action) => {
        state.customerProfile = action.payload;
    },
    updateResMenu: (state, action) => {
        state.customerMenu = action.payload;
    },
    updateResOrders: (state, action) => {
        state.customerOrders= action.payload;
    },
  },
});

export const { updateResProfile, updateResMenu, updateResOrders } = restaurantSlice.actions;

export default restaurantSlice.reducer;
