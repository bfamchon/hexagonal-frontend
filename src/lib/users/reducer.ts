import { relationshipsSlice } from '@/lib/users/slices/relationships.slice';
import { combineReducers } from '@reduxjs/toolkit';

export const reducer = combineReducers({
  [relationshipsSlice.name]: relationshipsSlice.reducer,
});
