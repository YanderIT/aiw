import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import RecommendationLetterGeneratorClient from "./components/RecommendationLetterGeneratorClient";

export default async function RecommendationLetterGeneratorPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  return <RecommendationLetterGeneratorClient />;
} 