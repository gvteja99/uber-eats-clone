import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCount } from './counterAPI';

const initialState = {
    customerProfile: {},
    customerMenu: [],
    customerOrders: [],
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateCustomerProfile: (state, action) => {
        state.customerProfile = action.payload;
    },
    updateCustomerMenu: (state, action) => {
        state.customerMenu = action.payload;
    },
    updateCustomerOrders: (state, action) => {
        state.customerOrders= action.payload;
    },
  },
});

export const { updateCustomerProfile, updateCustomerMenu, updateCustomerOrders } = customerSlice.actions;

export default customerSlice.reducer;
