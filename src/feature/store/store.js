import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authSlice from "../users/authSlice";

const reducer = combineReducers({
    login: authSlice
})


const store = configureStore({
    reducer: reducer
})

export default store;