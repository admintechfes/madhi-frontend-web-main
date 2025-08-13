import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  openLoader: false,
  openTableLoader: false,
  openProgramLoader:true,
  duplicateLoader: false,
}

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoader: (state, action) => {
      state.openLoader = true
    },
    hideLoader: (state, action) => {
      state.openLoader = false
    },
    showTableLoader: (state, action) => {
      state.openTableLoader = true
    },
    hideTableLoader: (state, action) => {
      state.openTableLoader = false
    },
    showProgramLoader: (state, action) => {
      state.openProgramLoader = true
    },
    hideProgramLoader: (state, action) => {
      state.openProgramLoader = false
    },
    duplicateLoader: (state, action) => {
      state.duplicateLoader = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { showLoader, hideLoader, showTableLoader, hideTableLoader, showProgramLoader, hideProgramLoader, duplicateLoader } = loaderSlice.actions

export default loaderSlice.reducer
