const { nowDate, uuid } = require('../utils/tools');
const axios = require('axios');
const md5 = require('md5');

function getHash(params, appSecret) {
  const sortedParams = Object.keys(params)
    .filter(key => key !== 'hash' && params[key] !== undefined && params[key] !== null && params[key] !== '') //过滤掉空值和hash本身
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  const stringSignTemp = sortedParams + appSecret;
  const hash = md5(stringSignTemp);
  return hash;
}

async function createPayment(options) {
  //发起支付的函数
  const appid = options.appid || process.env.XUNHU_APP_ID || '';
  const appSecret = options.appSecret || process.env.XUNHU_APP_SECRET || '';
  const paymentUrl = options.paymentUrl || process.env.XUNHU_PAYMENT_URL || 'https://api.xunhupay.com/payment/do.html';

  if (!appid || !appSecret) {
    throw new Error('xunhu pay is not configured');
  }

  const params = {
    version: '1.1',
    appid, //填写虎皮椒的APPID
    trade_order_id: options.order_id, //商户订单号
    total_fee: options.money, //金额，最多两位小数（单位：元）
    title: options.title,
    time: nowDate(),
    notify_url: options.notify_url, //通知回调网址,POST请求
    return_url: options.return_url,
    callback_url: options.callback_url,
    plugins: options.plugins || process.env.XUNHU_PLUGINS || 'nextjs-pricing',
    attach: options.attach,
    nonce_str: uuid(), //随机值
  };
  const hash = getHash(params, appSecret);
  // 发送 POST 请求
  const requestParams = new URLSearchParams();
  Object.entries({ ...params, hash }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      requestParams.append(key, String(value));
    }
  });

  const response = await axios.post(paymentUrl, requestParams, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = response.data;
  if (!data || typeof data !== 'object') {
    throw new Error('invalid xunhu response');
  }

  if (data.hash && data.hash !== getHash(data, appSecret)) {
    throw new Error('invalid xunhu response hash');
  }

  return data;
}

module.exports = { createPayment, getHash };
