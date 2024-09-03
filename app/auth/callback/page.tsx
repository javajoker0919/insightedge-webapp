"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";
import {
  userMetadataAtom,
  profileAtom,
  watchlistAtom,
  userInfoAtom,
  orgInfoAtom,
} from "@/utils/atoms";
import { getMixPanelClient } from "@/utils/mixpanel";

const Callback = () => {
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const setUserMetadata = useSetAtom(userMetadataAtom);
  const setProfile = useSetAtom(profileAtom);
  const setWatchlist = useSetAtom(watchlistAtom);

  const setUserInfo = useSetAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      const { data: userData, error: authError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user?.email)
        .single();

      if (!userData) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        setUserMetadata(sessionData.session?.user?.user_metadata || null);

        // Set user data using the userInfoAtom
        setUserInfo({
          id: sessionData.session?.user?.id || "",
          email: sessionData.session?.user?.email || "",
          firstName: "",
          lastName: "",
          companyName: "",
        });

        if (sessionData?.session?.access_token) {
          const mainURL = `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`;
          const accessTokenURL = `access_token=${sessionData?.session?.access_token}`;
          const expiresAtURL = `expires_at=${sessionData.session.expires_at}`;
          const expiresInURL = `expires_in=${sessionData.session.expires_in}`;
          const providerTokenURL = `provider_token=${sessionData.session.provider_token}`;
          const refreshTokenURL = `refresh_token=${sessionData.session.refresh_token}`;
          const tokenTypeURL = `token_type=${sessionData.session.token_type}`;

          router.push(
            `${mainURL}#${accessTokenURL}&${expiresAtURL}&${expiresInURL}&${providerTokenURL}&${refreshTokenURL}&${tokenTypeURL}`
          );
        } else {
          console.error("No access token found in session");
        }
      } else {
        setUserInfo({
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          companyName: "",
        });

        mixpanel.identify(userData.id);
        mixpanel.set({
          $name: `${userData.first_name} ${userData.last_name}`,
          $email: userData.email,
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
          .eq("creator_id", userData.id)
          .single();

        if (orgError) throw orgError;

        setOrgInfo({
          id: orgData.id,
          name: orgData.name,
          website: orgData.website,
          overview: orgData.overview,
          products: orgData.products,
          creatorID: orgData.creator_id,
        });

        setProfile({
          user_id: userData.id,
          org_id: orgData.id,
          credits: null,
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
          .eq("creator_id", userData.id);

        if (watchlistError) throw watchlistError;

        setWatchlist(
          watchlistData.map((item) => {
            return {
              id: item.id,
              name: item.name,
              organizationID: item.organization_id,
              creatorID: item.creator_id,
              uuid: item.uuid,
              company_count: item.watchlist_companies?.length,
            };
          })
        );

        router.replace(`/app/watchlist/${watchlistData[0].uuid}`);
      }
    } catch (error) {
      console.error("Error during callback:", error);
    }
  };

  return null;
};

export default Callback;
