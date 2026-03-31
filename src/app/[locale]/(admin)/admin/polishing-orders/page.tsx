import { getPolishingDocuments } from "@/models/document";
import { getSupabaseClient } from "@/models/db";
import PolishingOrdersClient from "./components/polishing-orders-client";

async function getPolishingOrders() {
  const supabase = getSupabaseClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("order_no, user_uuid, status, amount, paid_at, product_name, created_at")
    .eq("product_id", "polishing-single")
    .order("created_at", { ascending: false });

  return orders || [];
}

export default async function PolishingOrdersPage() {
  const documents = await getPolishingDocuments(1, 200);
  const orders = await getPolishingOrders();

  // 为每个文档匹配最近的订单
  const documentsWithPayment = documents.map((doc: any) => {
    const matchedOrder = orders.find(
      (o: any) => o.user_uuid === doc.user_uuid
        && new Date(o.created_at).getTime() >= new Date(doc.created_at).getTime() - 60000
    );
    return {
      ...doc,
      payment_status: matchedOrder?.status || "unpaid",
      order_no: matchedOrder?.order_no || null,
      paid_at: matchedOrder?.paid_at || null,
      paid_amount: matchedOrder?.amount || null,
    };
  });

  return <PolishingOrdersClient documents={documentsWithPayment} />;
}
