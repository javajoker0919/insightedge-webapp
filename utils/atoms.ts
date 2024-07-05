// lib/atoms.ts
import { atom } from "jotai";
import { UserMetadata } from "@supabase/supabase-js";
import { atomWithStorage } from "jotai/utils";

export const userMetadataAtom = atomWithStorage<UserMetadata | null>(
  "user-meta-data",
  null
);
