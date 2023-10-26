import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: null,
  user: null,
};
// const initialState = {
//   value: 0,
// };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    signOut: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
