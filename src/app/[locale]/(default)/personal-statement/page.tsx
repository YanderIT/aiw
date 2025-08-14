import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import PSGeneratorClient from "./components/PSGeneratorClient";

export default async function PersonalStatementPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  return <PSGeneratorClient />;
}