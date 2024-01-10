import { configureStore } from '@reduxjs/toolkit'

import userReducer from "./features/user/userSlice";
import cartReducer from "./features/cart/cartSlice";

/*
  store
*/
const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer
    }
})

export default store;