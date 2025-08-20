import bcrypt from 'bcryptjs';

/**
 * 哈希密码
 * @param password 明文密码
 * @returns 哈希后的密码
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hashedPassword 哈希后的密码
 * @returns 密码是否匹配
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 是否符合强度要求
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { isValid: false, message: "密码至少需要8个字符" };
  }
  
  if (password.length > 32) {
    return { isValid: false, message: "密码长度不能超过32个字符" };
  }
  
  // 至少包含一个字母和一个数字
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { isValid: false, message: "密码需要包含至少一个字母和一个数字" };
  }
  
  return { isValid: true };
} 