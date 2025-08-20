import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import ResumeResultClient from "./components/ResumeResultClient";

export default async function ResumeResultPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  return <ResumeResultClient />;
} 