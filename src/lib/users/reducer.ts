import { relationshipsSlice } from '@/lib/users/slices/relationships.slice';
import { userSlice } from '@/lib/users/slices/users.slice';
import { combineReducers } from '@reduxjs/toolkit';

export const reducer = combineReducers({
  [relationshipsSlice.name]: relationshipsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
});
