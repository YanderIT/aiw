import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import StudyAbroadResultClient from "./components/StudyAbroadResultClient";

interface PageProps {
  params: Promise<{
    uuid: string;
    locale: string;
  }>;
}

export default async function StudyAbroadResultPage({ params }: PageProps) {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  const { uuid, locale } = await params;

  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(`/study-abroad-consultation/result/${uuid}`));
  }

  return <StudyAbroadResultClient documentUuid={uuid} />;
}