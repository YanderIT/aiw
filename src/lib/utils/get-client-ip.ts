import { NextRequest } from 'next/server';

/**
 * 从请求中获取客户端真实IP地址
 * 处理各种代理和CDN的情况
 */
export function getClientIp(request: NextRequest): string | null {
  // 1. 检查 X-Forwarded-For header (最常见)
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // X-Forwarded-For 可能包含多个IP，取第一个
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  // 2. Cloudflare 特定的 header
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // 3. 其他常见的代理 headers
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // 4. Vercel 特定的 header
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    const ips = vercelIp.split(',').map(ip => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  // 5. 其他可能的 headers
  const clientIp = request.headers.get('client-ip');
  if (clientIp) {
    return clientIp;
  }

  // 6. 如果都没有，返回 null
  // 注意：在 Next.js App Router 中，无法直接获取 socket 连接的 IP
  return null;
}

/**
 * 验证IP地址格式是否有效
 */
export function isValidIp(ip: string): boolean {
  // IPv4 正则
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // 简化的 IPv6 正则
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  if (ipv4Regex.test(ip)) {
    // 验证每个段是否在 0-255 范围内
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  return ipv6Regex.test(ip);
}

/**
 * 获取IP地址的匿名版本（用于日志记录）
 * 隐藏最后一段，保护用户隐私
 */
export function anonymizeIp(ip: string | null): string {
  if (!ip) return 'unknown';
  
  if (ip.includes('.')) {
    // IPv4: 192.168.1.100 -> 192.168.1.xxx
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = 'xxx';
      return parts.join('.');
    }
  } else if (ip.includes(':')) {
    // IPv6: 简化处理，隐藏后半部分
    const parts = ip.split(':');
    if (parts.length > 4) {
      return parts.slice(0, 4).join(':') + ':xxxx:xxxx:xxxx:xxxx';
    }
  }
  
  return 'invalid-ip';
}