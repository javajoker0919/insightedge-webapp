// lib/atoms.ts
import { atom } from "jotai";
import { UserMetadata } from "@supabase/supabase-js";
import { atomWithStorage } from "jotai/utils";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  website: string;
  companyOverview: string;
  hasCompanyProfile: boolean;
  productsAndServices: string;
  authStepCompleted: number;
}

export const userMetadataAtom = atomWithStorage<UserMetadata | null>(
  "user-meta-data",
  null
);

export const userDataAtom = atom<User | null>(null);
