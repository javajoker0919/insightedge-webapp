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
    "/api/v1/multi-opportunities",
    earnings_transcript_ids
  );

  return response;
};

export {
  generateTailoredOpportunitiesAPI,
  generateTailoredSummaryAPI,
  updatePlan,
  createCustomer,
  customerPortal,
  cancelSubscription,
  stopCancelSubscription,
  generateTOAPI,
};
