// src/Redux/slices/collegeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Import necessary functions
import axios from 'axios';


const collegeSlice = createSlice({
  name: 'colleges',
  initialState: {
    colleges: [],
    token: localStorage.getItem('access_token') || '',
  },
  reducers: {
    setAllColleges: (state, action) => {
      state.colleges = action.payload;
    },
    updateCollege: (state, action) => {
      const updatedCollege = action.payload;
      state.colleges = state.colleges.map(college =>
        college.id === updatedCollege.id ? updatedCollege : college
      );
    },
    setToken: (state, action) => {
      state.token = action.payload;
    }
  }
});

export const { setAllColleges, updateCollege, setToken } = collegeSlice.actions;

export default collegeSlice.reducer;
