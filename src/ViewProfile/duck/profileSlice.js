import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  loading: false,
  profileDetails: {},
}


export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
  

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    fillProfileDetails: (state, action) => {
      state.profileDetails = action.payload;
    },
   
  }

})

export const {fillProfileDetails,setLoading}=profileSlice.actions

export default profileSlice.reducer;