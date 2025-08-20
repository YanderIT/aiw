import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import CoverLetterResultClient from "./components/CoverLetterResultClient";

export default async function CoverLetterResultPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  return <CoverLetterResultClient />;
} 