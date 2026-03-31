import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";
import { getAvailableQuota, FUNCTION_TYPE_TO_SERVICE } from "@/models/service-quota";

export async function GET(req: NextRequest) {
  try {
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respErr("请先登录", 401);
    }

    const functionType = req.nextUrl.searchParams.get("function_type") || "";
    const serviceType = FUNCTION_TYPE_TO_SERVICE[functionType];

    if (!serviceType) {
      return respErr("未知的服务类型");
    }

    const specific = await getAvailableQuota(userUuid, serviceType);
    const universal = serviceType !== "universal"
      ? await getAvailableQuota(userUuid, "universal")
      : 0;

    const available = specific + universal;

    return respData({
      available,
      service_type: serviceType,
      enough: available > 0,
    });
  } catch (error: any) {
    return respErr("检查配额失败: " + error.message);
  }
}
