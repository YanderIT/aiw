/**
 * 简单的基于内存的速率限制器
 * 用于限制用户和IP的上传频率
 */

interface RateLimitRecord {
  count: number;
  firstRequestTime: number;
  lastRequestTime: number;
}

class SimpleRateLimiter {
  private userLimits: Map<string, RateLimitRecord> = new Map();
  private ipLimits: Map<string, RateLimitRecord> = new Map();
  
  // 配置参数
  private readonly USER_LIMIT = 10; // 用户限制：5分钟内最多10次
  private readonly IP_LIMIT = 20; // IP限制：5分钟内最多20次
  private readonly TIME_WINDOW = 5 * 60 * 1000; // 5分钟时间窗口（毫秒）
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1小时清理一次

  constructor() {
    // 定期清理过期记录
    this.startCleanupTimer();
  }

  /**
   * 检查是否超过速率限制
   * @returns { allowed: boolean, waitTime?: number, reason?: string }
   */
  checkLimit(userId?: string, ip?: string): { 
    allowed: boolean; 
    waitTime?: number; 
    reason?: string;
    userCount?: number;
    ipCount?: number;
  } {
    const now = Date.now();
    
    // 检查用户限制
    if (userId) {
      const userRecord = this.userLimits.get(userId);
      if (userRecord) {
        const timePassed = now - userRecord.firstRequestTime;
        
        // 如果超过时间窗口，重置记录
        if (timePassed > this.TIME_WINDOW) {
          this.userLimits.set(userId, {
            count: 1,
            firstRequestTime: now,
            lastRequestTime: now
          });
        } else if (userRecord.count >= this.USER_LIMIT) {
          // 计算需要等待的时间
          const waitTime = this.TIME_WINDOW - timePassed;
          return {
            allowed: false,
            waitTime: Math.ceil(waitTime / 1000), // 转换为秒
            reason: `用户上传次数超限，请等待 ${Math.ceil(waitTime / 1000)} 秒`,
            userCount: userRecord.count
          };
        } else {
          // 增加计数
          userRecord.count++;
          userRecord.lastRequestTime = now;
        }
      } else {
        // 新用户，创建记录
        this.userLimits.set(userId, {
          count: 1,
          firstRequestTime: now,
          lastRequestTime: now
        });
      }
    }

    // 检查IP限制
    if (ip) {
      const ipRecord = this.ipLimits.get(ip);
      if (ipRecord) {
        const timePassed = now - ipRecord.firstRequestTime;
        
        // 如果超过时间窗口，重置记录
        if (timePassed > this.TIME_WINDOW) {
          this.ipLimits.set(ip, {
            count: 1,
            firstRequestTime: now,
            lastRequestTime: now
          });
        } else if (ipRecord.count >= this.IP_LIMIT) {
          // 计算需要等待的时间
          const waitTime = this.TIME_WINDOW - timePassed;
          return {
            allowed: false,
            waitTime: Math.ceil(waitTime / 1000), // 转换为秒
            reason: `IP上传次数超限，请等待 ${Math.ceil(waitTime / 1000)} 秒`,
            ipCount: ipRecord.count
          };
        } else {
          // 增加计数
          ipRecord.count++;
          ipRecord.lastRequestTime = now;
        }
      } else {
        // 新IP，创建记录
        this.ipLimits.set(ip, {
          count: 1,
          firstRequestTime: now,
          lastRequestTime: now
        });
      }
    }

    return { 
      allowed: true,
      userCount: userId ? this.userLimits.get(userId)?.count : undefined,
      ipCount: ip ? this.ipLimits.get(ip)?.count : undefined
    };
  }

  /**
   * 手动重置特定用户或IP的限制
   */
  resetLimit(userId?: string, ip?: string) {
    if (userId) {
      this.userLimits.delete(userId);
    }
    if (ip) {
      this.ipLimits.delete(ip);
    }
  }

  /**
   * 获取当前限制状态（用于调试）
   */
  getStatus(userId?: string, ip?: string) {
    return {
      userRecord: userId ? this.userLimits.get(userId) : undefined,
      ipRecord: ip ? this.ipLimits.get(ip) : undefined,
      userLimitConfig: { limit: this.USER_LIMIT, windowMinutes: this.TIME_WINDOW / 60000 },
      ipLimitConfig: { limit: this.IP_LIMIT, windowMinutes: this.TIME_WINDOW / 60000 }
    };
  }

  /**
   * 定期清理过期记录，防止内存泄漏
   */
  private startCleanupTimer() {
    setInterval(() => {
      const now = Date.now();
      
      // 清理用户记录
      for (const [userId, record] of this.userLimits.entries()) {
        if (now - record.lastRequestTime > this.TIME_WINDOW) {
          this.userLimits.delete(userId);
        }
      }
      
      // 清理IP记录
      for (const [ip, record] of this.ipLimits.entries()) {
        if (now - record.lastRequestTime > this.TIME_WINDOW) {
          this.ipLimits.delete(ip);
        }
      }
      
      console.log(`[RateLimiter] 清理完成，当前记录数 - 用户: ${this.userLimits.size}, IP: ${this.ipLimits.size}`);
    }, this.CLEANUP_INTERVAL);
  }
}

// 创建单例实例
export const rateLimiter = new SimpleRateLimiter();