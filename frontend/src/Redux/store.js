// src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import collegeReducer from './slices/collegeSlice';

const store = configureStore({
  reducer: {
    colleges: collegeReducer,
  },
});

export default store;
