import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import StudyAbroadGeneratorClient from "./components/StudyAbroadGeneratorClient";

export default async function StudyAbroadConsultationPage() {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  return <StudyAbroadGeneratorClient />;
}