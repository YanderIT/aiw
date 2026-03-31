import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import RecommendationLetterResultClient from "./components/RecommendationLetterResultClient";

interface PageProps {
  params: Promise<{
    uuid: string;
    locale: string;
  }>;
}

export default async function RecommendationLetterResultPage({ params }: PageProps) {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }
  
  const { uuid } = await params;

  return <RecommendationLetterResultClient documentUuid={uuid} />;
} 