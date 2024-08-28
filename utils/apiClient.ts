import axios from "axios";
import { supabase } from "./supabaseClient";

const getAuthToken = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) throw new Error("No user logged in");
  return session?.access_token;
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

const generateTailoredSummaryAPI = (params: {
  companyID: string;
  orgID: string;
  year: number;
  quarter: number;
}) => generateTailoredAPI("summary", params);

const updatePlan = async (plan: string) => {
  const apiClient = await createApiClient();
  const response = await apiClient.post("/api/v1/update-plan", {
    plan,
  });
  return response.data;
};

const createCustomer = async () => {
  const apiClient = await createApiClient();
  const response = await apiClient.post("/api/v1/create-customer");
  return response.data;
};

const customerPortal = async () => {
  const apiClient = await createApiClient();
  const response = await apiClient.get("/api/v1/customer-portal");
  return response.data;
};

const cancelSubscription = async () => {
  const apiClient = await createApiClient();
  const response = await apiClient.post("/api/v1/cancel-subscription");
  return response.data;
};

const stopCancelSubscription = async () => {
  const apiClient = await createApiClient();
  const response = await apiClient.post("/api/v1/stop-cancel-subscription");
  return response.data;
};

const generateTOAPI = async (etIDs: number[]) => {
  const earnings_transcript_ids = { earnings_transcript_ids: etIDs };
  const apiClient = await createApiClient();
  const response = await apiClient.post(
    "/api/v1/generate/opportunities",
    earnings_transcript_ids
  );

  return response;
};

const generateTMAPI = async (etIDs: number[]) => {
  const earnings_transcript_ids = { earnings_transcript_ids: etIDs };
  const apiClient = await createApiClient();
  const response = await apiClient.post(
    "/api/v1/generate/marketings",
    earnings_transcript_ids
  );

  return response;
};

const getScrapeData = async (data: {
  company_name: string;
  company_url: string;
}) => {
  const apiClient = await createApiClient();
  const response = await apiClient.get("/api/v1/onboarding", {
    params: {
      company_name: data.company_name,
      company_url: data.company_url,
    },
  });
  return response.data;
};

const getSchedule = async (data: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/v1/schedule`,
    data
  );
  return response.data;
};

const emailShare = async (data: {
  user_id: string;
  earnings_transcript_id: string;
  organization_id: string;
  share_email_ids: string[];
}) => {
  const apiClient = await createApiClient();
  return await apiClient.post("/api/v1/email-share", data);
};

export {
  generateTailoredSummaryAPI,
  updatePlan,
  createCustomer,
  customerPortal,
  cancelSubscription,
  stopCancelSubscription,
  generateTOAPI,
  generateTMAPI,
  getScrapeData,
  getSchedule,
  emailShare,
};
