import { handlePaidOrder } from "@/services/order";

const xunhuSdk = require("../../../models/jsSDK(1).js");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const payload = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
    );

    const { hash } = payload;
    const expectedHash = xunhuSdk.getHash(payload, process.env.XUNHU_APP_SECRET || "");
    if (!hash || hash !== expectedHash) {
      console.log("xunhu notify invalid hash", payload);
      return new Response("success");
    }

    if (payload.status === "OD" && typeof payload.trade_order_id === "string") {
      await handlePaidOrder({
        order_no: payload.trade_order_id,
        paid_detail: JSON.stringify(payload),
      });
    }

    return new Response("success");
  } catch (error) {
    console.log("xunhu notify failed", error);
    return new Response("fail", { status: 500 });
  }
}
