const { getNonceStr, getUuid } = require("../lib/hash");
const { getTimestamp } = require("../lib/time");

function formatResponse(success, data) {
  return { success, data };
}

function nowDate() {
  return getTimestamp();
}

function uuid() {
  const value = typeof getUuid === "function" ? getUuid() : getNonceStr(32);
  return String(value).replace(/-/g, "") || getNonceStr(32);
}

module.exports = {
  formatResponse,
  nowDate,
  uuid,
};
