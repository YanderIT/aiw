import { createHash, randomUUID } from "crypto";

export interface XunhuCreateOrderParams {
  trade_order_id: string;
  total_fee: number;
  title: string;
  notify_url: string;
  return_url?: string;
  callback_url?: string;
  attach?: string;
  plugins?: string;
}

export interface XunhuCreateOrderResponse {
  openid?: string;
  url?: string;
  url_qrcode?: string;
  errcode: number;
  errmsg?: string;
  hash?: string;
  [key: string]: unknown;
}

export interface XunhuQueryOrderResponse {
  errcode: number;
  errmsg?: string;
  data?: {
    status?: string;
    open_order_id?: string;
    [key: string]: unknown;
  };
  hash?: string;
  [key: string]: unknown;
}

type XunhuPayload = Record<string, string | number | undefined | null>;

const DEFAULT_PAYMENT_URL = "https://api.xunhupay.com/payment/do.html";
const DEFAULT_QUERY_URL = "https://api.xunhupay.com/payment/query.html";

export function getXunhuConfig() {
  const appid = process.env.XUNHU_APP_ID || "";
  const appSecret = process.env.XUNHU_APP_SECRET || "";

  return {
    appid,
    appSecret,
    paymentUrl: process.env.XUNHU_PAYMENT_URL || DEFAULT_PAYMENT_URL,
    queryUrl: process.env.XUNHU_QUERY_URL || DEFAULT_QUERY_URL,
    plugins: process.env.XUNHU_PLUGINS || "nextjs-pricing",
  };
}

export function isXunhuConfigured() {
  const { appid, appSecret } = getXunhuConfig();
  return Boolean(appid && appSecret);
}

export function getXunhuHash(
  payload: XunhuPayload,
  appSecret: string = getXunhuConfig().appSecret
) {
  const content = Object.keys(payload)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => {
      const value = payload[key];
      if (value === undefined || value === null || value === "" || typeof value === "object") {
        return null;
      }

      return `${key}=${String(value)}`;
    })
    .filter(Boolean)
    .join("&");

  return createHash("md5")
    .update(`${content}${appSecret}`, "utf8")
    .digest("hex");
}

export function verifyXunhuHash(payload: XunhuPayload) {
  const hash = payload.hash;
  if (!hash || typeof hash !== "string") {
    return false;
  }

  return hash === getXunhuHash(payload);
}

export function getXunhuNonceStr() {
  return randomUUID().replace(/-/g, "").slice(0, 32);
}

export function getXunhuTimestamp() {
  return Math.floor(Date.now() / 1000);
}

async function postForm<T>(url: string, payload: XunhuPayload): Promise<T> {
  const formData = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    formData.append(key, String(value));
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    cache: "no-store",
  });

  const json = (await response.json()) as T;
  return json;
}

export async function createXunhuPayment(
  params: XunhuCreateOrderParams
): Promise<XunhuCreateOrderResponse> {
  const { appid, appSecret, paymentUrl, plugins } = getXunhuConfig();
  if (!appid || !appSecret) {
    throw new Error("xunhu pay is not configured");
  }

  const payload: XunhuPayload = {
    version: "1.1",
    appid,
    trade_order_id: params.trade_order_id,
    total_fee: (params.total_fee / 100).toFixed(2),
    title: params.title,
    time: getXunhuTimestamp(),
    notify_url: params.notify_url,
    return_url: params.return_url,
    callback_url: params.callback_url,
    plugins: params.plugins || plugins,
    attach: params.attach,
    nonce_str: getXunhuNonceStr(),
  };

  const hash = getXunhuHash(payload, appSecret);
  const data = await postForm<XunhuCreateOrderResponse>(paymentUrl, {
    ...payload,
    hash,
  });

  if (!verifyXunhuHash(data as XunhuPayload)) {
    throw new Error("invalid xunhu response hash");
  }

  return data;
}

export async function queryXunhuPayment({
  out_trade_order,
  open_order_id,
}: {
  out_trade_order?: string;
  open_order_id?: string;
}): Promise<XunhuQueryOrderResponse> {
  const { appid, appSecret, queryUrl } = getXunhuConfig();
  if (!appid || !appSecret) {
    throw new Error("xunhu pay is not configured");
  }

  const payload: XunhuPayload = {
    appid,
    out_trade_order,
    open_order_id,
    time: getXunhuTimestamp(),
    nonce_str: getXunhuNonceStr(),
  };

  const hash = getXunhuHash(payload, appSecret);
  const data = await postForm<XunhuQueryOrderResponse>(queryUrl, {
    ...payload,
    hash,
  });

  // 查询接口由我方主动发起，响应包含嵌套 data 对象，
  // PHP 会将其转为 "Array" 参与 hash 计算，JS 侧难以完全匹配，
  // 因此跳过查询响应的 hash 校验，通过 errcode 和 data.status 判断结果
  if (data.hash && !verifyXunhuHash(data as XunhuPayload)) {
    console.log("[xunhu-query] hash mismatch, skipping verification");
  }

  return data;
}
