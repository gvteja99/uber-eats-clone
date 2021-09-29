import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCount } from './counterAPI';

const initialState = {
    allRestList: [],
    favResList: [],
    token: "",
    // 1 for customer and 2 for restaurant
    userType: undefined,
    resProfile: {},
    resMenu: [],
    resOrders: [],
    customerProfile: {},
    customerMenu: [],
    customerOrders: [],
    selectedRes: null,
    cart: [],
    signupPopup: false,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    onResLogin: (state, action) => {
      const data = action.payload;
      state.token= data.token;
      state.resProfile = data;
      state.userType = 2;
    },
    onCustomerSignup: (state, action) => {
      alert("Redux action is called");
    },
    onCustomerLogin: (state, action) => {
      const data = action.payload;
      state.token= data.token;
      state.customerProfile = data;
      state.userType = 1;
    },
    onCustomerLogout: (state, action) => {
      state.token= '';
      state.userType = undefined;
    },
    onResLogout: (state, action) => {
      state.token= '';
      state.userType = undefined;
    },
    updateResProfile: (state, action) => {
      state.resProfile = action.payload;
    },
    updateCustomerProfile: (state, action) => {
      state.customerProfile = action.payload;
    },
    getResMenu: (state, action) => {
      console.log("action", action.payload);
      state.resMenu = action.payload;
    },
    getAllResList: (state, action) => {
      state.allRestList = action.payload;
      console.log("========actionpayload", action.payload);
    },
    getFavResList: (state, action) => {
      state.favResList = action.payload;
    },
    deleteResFromFavList: (state, action) => {
      const  { favourite_id } = action.payload
      const favList = state.favResList;
      const index = favList.findIndex(res => res?.favourite_id === favourite_id);
      if (index !== -1) {
        favList.splice(index, 1);
      }
      state.favResList = favList;
    },

    updateCustomerMenu: (state, action) => {
        state.customerMenu = action.payload;
    },
    updateCustomerOrders: (state, action) => {
        state.customerOrders= action.payload;
    },
    updateResOrders: (state, action) => {
        state.customerOrders= action.payload;
    },
    addDishToCart: (state, action) => {
      console.log("action ========", action.payload);
      const payload = action.payload
      let cartList = state.cart;
      console.log("cartList1", cartList);
      // cartList = [res: { dishes: [dishquan]]
      const resIndex = cartList.findIndex(res => res.res_id === payload?.res?.res_id);
      if (resIndex === -1) {
        cartList.push({...payload?.res, dishes: [{ ...payload?.dish, quantity: 1}]})
      } else {
        const dishIndex= cartList[resIndex].dishes.findIndex(dish => dish.res_menu_id === payload?.dish?.res_menu_id);
        if (dishIndex === -1) {
          cartList[resIndex]?.dishes?.push({...payload?.dish, quantity: 1})
        } else {
          alert("Dish already added in cart")
        }
      }
      // const item = {res: payload?.res, dish: payload?.dish, quantity: 1}
      // cartList.push(item)
      console.log("cartList", cartList);
      state.cart = cartList;
    },
    removeDishToCart: (state, action) => {
      let cartList = state.cart;
      const index = cartList.findIndex(item => item?.res?.res_menu_id === action.payload?.dish?.res_menu_id);
      if (index !== -1) {
        cartList.splice(index, 1);
      }
      state.cart = cartList;
    },
    clearCart: (state, action) => {
      state.cart = [];
    },
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
    changeToken: (state, action) => {
        state.token = action.payload;
    },
    selectUserType: (state, action) => {
        state.userType = action.payload;
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
//   extraReducers: (builder) => {
//     builder
//       .addCase(incrementAsync.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(incrementAsync.fulfilled, (state, action) => {
//         state.status = 'idle';
//         state.value += action.payload;
//       });
//   },
});

export const {
  onCustomerSignup, onCustomerLogin, onResLogin, onCustomerLogout, onResLogout,
  updateResProfile, updateCustomerProfile, getResMenu, getAllResList, getFavResList, deleteResFromFavList,
  changeToken, selectUserType, addDishToCart, removeDishToCart, clearCart,
  updateCustomerMenu, updateCustomerOrders,
  updateResOrders
 } = mainSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default mainSlice.reducer;
