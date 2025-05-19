import { createEntityAdapter } from '@reduxjs/toolkit';

export type User = {
  id: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
};

export const userAdapter = createEntityAdapter<User>();
