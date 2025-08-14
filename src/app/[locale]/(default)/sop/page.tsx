import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import SOPGeneratorClient from "./components/SOPGeneratorClient";

export default async function SOPPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  return <SOPGeneratorClient />;
} 