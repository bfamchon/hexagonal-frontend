import { createEntityAdapter } from '@reduxjs/toolkit';

export type Relationship = {
  user: string;
  follows: string;
};

export const relationshipsAdapter = createEntityAdapter<Relationship>({
  selectId: (relationship) => `${relationship.user}-${relationship.follows}`,
});
