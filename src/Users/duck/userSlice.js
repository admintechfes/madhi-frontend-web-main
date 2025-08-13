import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  loadingUser:false,
  loading: false,
  userList: [],
  paginateInfo: {},
  userDetails: {},
  userRoleNameList:[],
  filterDistrict:"",
  filterVillage:"",
  filterRole:"",
  applyFilter:false,
  cewDelegateList:[],
  pageNum:1,
  perPageNum:10,
}


export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fillUserList: (state, action) => {
      state.userList = action.payload.data;
      state.paginateInfo.to = action.payload.meta.to;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
      localStorage.removeItem("currentTeam")
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLoadingUser: (state, action) => {
      state.loadingUser = action.payload;
    },
    fillUserDetails: (state, action) => {
      state.userDetails = action.payload;
      window.localStorage.setItem('currentTeam', JSON.stringify({...action.payload,status: "active"}));
    },
    fillUserRoleNameList:(state,action)=>{
      state.userRoleNameList=action.payload.data;
    },
    fillFilterDistrict:(state,action)=>{
      state.filterDistrict=action.payload
    },
    fillCEWDelegateList:(state,action)=>{
      state.cewDelegateList=action.payload
    },
    fillFilterVillage:(state,action)=>{
      state.filterVillage=action.payload
    },
    fillFilterRole:(state,action)=>{
      state.filterRole=action.payload
    },
    fillApplyFilter:(state,action)=>{
      state.applyFilter=action.payload
    },
    fillPageNum:(state,action)=>{
      state.pageNum=action.payload
    },
    fillPerPageNum:(state,action)=>{
      state.perPageNum=action.payload
    }
  }

})

export const {fillPageNum,fillPerPageNum,fillUserDetails,fillCEWDelegateList,fillUserList,setLoading,fillUserRoleNameList,fillFilterRole,fillFilterVillage,fillFilterDistrict,fillApplyFilter,setLoadingUser}=userSlice.actions

export default userSlice.reducer;