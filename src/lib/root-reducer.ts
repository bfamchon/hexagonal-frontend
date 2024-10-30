import { reducer as usersReducer } from '@/lib/users/reducer';
import { combineReducers } from '@reduxjs/toolkit';
import { reducer as authReducer } from './auth/reducer';
import { reducer as timelinesReducer } from './timelines/reducer';

export const rootReducer = combineReducers({
  timelines: timelinesReducer,
  auth: authReducer,
  users: usersReducer,
});
