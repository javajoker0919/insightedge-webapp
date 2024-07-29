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
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });
};

const generateTailoredAPI = async (
  endpoint: string,
  params: {
    companyID: string;
    orgID: string;
    year: number;
    quarter: number;
  }
) => {
  const { companyID, orgID, ...queryParams } = params;
  const apiClient = await createApiClient();
  const url = `/api/v1/${endpoint}/${companyID}`;
  return apiClient.get(url, {
    params: { org_id: orgID, ...queryParams },
  });
};

const generateTailoredOpportunitiesAPI = (params: {
  companyID: string;
  orgID: string;
  year: number;
  quarter: number;
}) => generateTailoredAPI("opportunities", params);

const generateTailoredSummaryAPI = (params: {
  companyID: string;
  orgID: string;
  year: number;
  quarter: number;
}) => generateTailoredAPI("summary", params);

export { generateTailoredOpportunitiesAPI, generateTailoredSummaryAPI };
