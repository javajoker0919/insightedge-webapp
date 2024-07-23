import axios from "axios";
import { supabase } from "./supabaseClient";

const getAuthToken = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) throw new Error("No user logged in");
  return session.provider_token || session.access_token;
};

const createApiClient = async () => {
  const token = await getAuthToken();
  return axios.create({
    baseURL: process.env.SERVER_BASE_API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const generateTailoredOpportunitiesAPI = async ({
  companyID,
  orgID,
  year,
  quarter,
}: {
  companyID: string;
  orgID: string;
  year: number;
  quarter: number;
}) => {
  const apiClient = await createApiClient();
  const url = `${
    process.env.API_BASE_URL || "http://localhost:8000"
  }/api/v1/opportunities/${companyID}`;

  return apiClient.get(url, {
    params: { org_id: orgID, year, quarter },
  });
};

const generateTailoredSummaryAPI = async ({
  companyID,
  orgID,
  year,
  quarter,
}: {
  companyID: string;
  orgID: string;
  year: number;
  quarter: number;
}) => {
  const apiClient = await createApiClient();
  const url = `${
    process.env.API_BASE_URL || "http://localhost:8000"
  }/api/v1/summary/${companyID}`;

  return apiClient.get(url, {
    params: { org_id: orgID, year, quarter },
  });
};

export { generateTailoredOpportunitiesAPI, generateTailoredSummaryAPI };
