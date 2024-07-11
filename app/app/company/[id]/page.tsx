"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

const CompanyDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const [companyData, setCompanyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) {
        console.error("Error fetching company data:", error);
      } else {
        setCompanyData(data);
      }
      setIsLoading(false);
    };

    fetchCompanyData();
  }, [companyId]);

  return (
    <div className="m-auto">
      {isLoading ? (
        <div>Loading...</div>
      ) : !companyData ? (
        <div>Company not found</div>
      ) : (
        <>
          <h1>{companyData.name}</h1>
          <p>Symbol: {companyData.symbol}</p>
        </>
      )}
    </div>
  );
};

export default CompanyDetailPage;
