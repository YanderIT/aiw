import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import ResumeGeneratorClient from "./components/ResumeGeneratorClient";

export default async function ResumeGeneratorPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  return <ResumeGeneratorClient />;
} 