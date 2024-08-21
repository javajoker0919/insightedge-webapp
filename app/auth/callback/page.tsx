"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useSetAtom } from "jotai";
import {
  userMetadataAtom,
  userInfoAtom,
  orgInfoAtom,
  watchlistAtom
} from "@/utils/atoms";
import { useRouter } from "next/navigation";
import { useToastContext } from "@/contexts/toastContext";

const Callback = () => {
  const setUserData = useSetAtom(userInfoAtom);
  const setUserMetadata = useSetAtom(userMetadataAtom);
  const router = useRouter();
  const setUserInfo = useSetAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setWatchlist = useSetAtom(watchlistAtom);
  const { invokeToast } = useToastContext();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        const { data: authData, error: authError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user?.email)
          .single();

        if (!authData) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError) throw sessionError;

          setUserMetadata(sessionData.session?.user?.user_metadata || null);

          // Set user data using the userInfoAtom
          setUserData({
            id: sessionData.session?.user?.id || "",
            email: sessionData.session?.user?.email || "",
            firstName: "",
            lastName: "",
            companyName: "",
          });

          if (sessionData?.session?.access_token) {
            window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/onboarding#access_token=${sessionData?.session?.access_token}&expires_at=${sessionData.session.expires_at}&expires_in=${sessionData.session.expires_in}&provider_token=${sessionData.session.provider_token}&refresh_token=${sessionData.session.refresh_token}&token_type=${sessionData.session.token_type}`;
          } else {
            console.error("No access token found in session");
          }
        } else {
          setUserInfo({
            id: authData.id,
            email: authData.email,
            firstName: authData.first_name,
            lastName: authData.last_name,
            companyName: "",
          });

          const { data: orgData, error: orgError } = await supabase
            .from("organizations")
            .select(
              `
              id, 
              name, 
              website, 
              overview, 
              products, 
              creator_id
              `
            )
            .eq("creator_id", authData.id)
            .single();

          if (orgError) throw orgError;

          setOrgInfo({
            id: orgData.id,
            name: orgData.name,
            website: orgData.website,
            overview: orgData.overview,
            products: orgData.products,
            creatorID: orgData.creator_id
          });

          const { data: watchlistData, error: watchlistError } = await supabase
            .from("watchlists")
            .select(
              `
              id, 
              name, 
              organization_id, 
              creator_id,
              uuid,
              watchlist_companies!left(id, company_id)
              `
            )
            .eq("creator_id", authData.id);

          if (watchlistError) throw watchlistError;

          setWatchlist(
            watchlistData.map((item) => {
              return {
                id: item.id,
                name: item.name,
                organizationID: item.organization_id,
                creatorID: item.creator_id,
                uuid: item.uuid,
                company_count: item.watchlist_companies?.length
              };
            })
          );

          router.replace(`/app/watchlist/${watchlistData[0].uuid}`);
        }
      } catch (error) {
        console.error("Error during callback:", error);
        // Handle error (e.g., redirect to error page or show error message)
      }
    };

    handleCallback();
  }, []);

  return null;
};

export default Callback;
