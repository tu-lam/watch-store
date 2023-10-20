import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: null,
};
// const initialState = {
//   value: 0,
// };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      localStorage.setItem("token", action.payload);
      state.token = action.payload.token;
    },
    signOut: (state) => {
      localStorage.removeItem("token");
      state.token = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
