import { getNonceStr, getUuid } from "@/lib/hash";
import { getTimestamp } from "@/lib/time";

export function formatResponse(success: boolean, data?: unknown) {
  return {
    success,
    data,
  };
}

export function nowDate() {
  return getTimestamp();
}

export function uuid() {
  return getUuid().replace(/-/g, "") || getNonceStr(32);
}
