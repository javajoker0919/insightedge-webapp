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
  creditCount?: number | null;
}

interface Organization {
  id: number;
  name: string;
  website: string;
  overview: string;
  products: string;
  creatorID: string;
}

interface Watchlist {
  id: number;
  name: string;
  organizationID: number;
  creatorID: string;
  uuid: string;
  company_count?: number;
}

interface Profile {
  user_id: string;
  org_id: number;
  credits: number | null;
}

export const userMetadataAtom = atomWithStorage<UserMetadata | null>(
  "user-meta-data",
  null
);

export const profileAtom = atomWithStorage<Profile | null>("profile", null);

export const userInfoAtom = atomWithStorage<User | null>("user-info", null);
export const orgInfoAtom = atomWithStorage<Organization | null>(
  "org-info",
  null
);
export const watchlistAtom = atomWithStorage<Watchlist[] | null>(
  "watchlists",
  null
);
export const isSidebarExpandedAtom = atom<boolean>(false);
