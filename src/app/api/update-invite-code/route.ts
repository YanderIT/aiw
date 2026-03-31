import {
  findUserByInviteCode,
  findUserByUuid,
  updateUserInviteCode,
} from "@/models/user";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST() {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const user_info = await findUserByUuid(user_uuid);
    if (!user_info || !user_info.email) {
      return respErr("invalid user");
    }

    // 已有邀请码直接返回
    if (user_info.invite_code) {
      return respData(user_info);
    }

    // 自动生成唯一邀请码
    let invite_code = "";
    for (let i = 0; i < 10; i++) {
      const candidate = generateInviteCode();
      const existing = await findUserByInviteCode(candidate);
      if (!existing) {
        invite_code = candidate;
        break;
      }
    }

    if (!invite_code) {
      return respErr("生成邀请码失败，请重试");
    }

    await updateUserInviteCode(user_uuid, invite_code);
    user_info.invite_code = invite_code;

    return respData(user_info);
  } catch (e) {
    console.log("generate invite code failed", e);
    return respErr("生成邀请码失败");
  }
}
