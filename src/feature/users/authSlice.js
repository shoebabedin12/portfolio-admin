import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userLogin: localStorage.getItem("User") ? JSON.parse(localStorage.getItem("User")) : null
}


export const userSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducer: {
        LoginUser:(state, action)=>{
            state.userLogin = action.payload
        }
    }
})

export const {LoginUser} = userSlice.actions

export default userSlice.reducer