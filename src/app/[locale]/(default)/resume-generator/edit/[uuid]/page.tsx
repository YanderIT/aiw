import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import ResumeEditClient from "./components/ResumeEditClient";

interface PageProps {
  params: Promise<{
    uuid: string;
    locale: string;
  }>;
}

export default async function ResumeEditPage({ params }: PageProps) {
  const t = await getTranslations();
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }
  
  const { uuid } = await params;

  return <ResumeEditClient documentUuid={uuid} />;
}