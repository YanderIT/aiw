import { redirect } from "next/navigation";
import PaySuccessClient from "./components/PaySuccessClient";

export default async function PaySuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ provider?: string; order_no?: string }>;
}) {
  const { locale } = await params;
  const { provider, order_no } = await searchParams;

  if (provider !== "xunhupay" || !order_no) {
    redirect(process.env.NEXT_PUBLIC_PAY_FAIL_URL || "/");
  }

  return <PaySuccessClient orderNo={order_no} locale={locale} />;
}
