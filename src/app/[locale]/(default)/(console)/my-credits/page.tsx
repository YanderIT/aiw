import Empty from "@/components/blocks/empty";
import TableSlot from "@/components/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getCreditsByUserUuid } from "@/models/credit";
import { getTranslations } from "next-intl/server";
import { getUserCredits } from "@/services/credit";
import { getUserUuid } from "@/services/user";
import { getUserQuotaSummary } from "@/models/service-quota";
import moment from "moment";

export default async function () {
  const t = await getTranslations();

  const user_uuid = await getUserUuid();

  if (!user_uuid) {
    return <Empty message="no auth" />;
  }

  const data = await getCreditsByUserUuid(user_uuid, 1, 100);
  const userCredits = await getUserCredits(user_uuid);
  const quotaSummary = await getUserQuotaSummary(user_uuid);

  const serviceLabels: Record<string, string> = {
    ps_sop: "PS/SOP",
    recommendation: "推荐信",
    cover_letter: "Cover Letter",
    resume: "简历",
    universal: "通用",
  };

  const quotaDisplay = Object.entries(quotaSummary)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => `${serviceLabels[type] || type}: ${count}次`)
    .join("  |  ");

  const table: TableSlotType = {
    title: t("my_credits.title"),
    tip: {
      title: quotaDisplay
        ? `剩余次数 — ${quotaDisplay}`
        : "暂无可用次数，请购买套餐",
    },
    toolbar: {
      items: [
        {
          title: t("my_credits.recharge"),
          url: "/pricing",
          target: "_blank",
          icon: "RiBankCardLine",
        },
      ],
    },
    columns: [
      {
        title: t("my_credits.table.trans_no"),
        name: "trans_no",
      },
      {
        title: t("my_credits.table.trans_type"),
        name: "trans_type",
      },
      {
        title: t("my_credits.table.credits"),
        name: "credits",
      },
      {
        title: t("my_credits.table.updated_at"),
        name: "created_at",
        callback: (v: any) => {
          return moment(v.created_at).format("YYYY-MM-DD HH:mm:ss");
        },
      },
    ],
    data,
    empty_message: t("my_credits.no_credits"),
  };

  return (
    <div className="space-y-6">
      {/* 服务配额卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4">
        {Object.entries(serviceLabels).map(([type, label]: [string, string]) => (
          <div
            key={type}
            className="bg-white dark:bg-gray-950 border rounded-lg p-4 text-center"
          >
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold">
              {quotaSummary[type as keyof typeof quotaSummary] || 0}
            </p>
            <p className="text-xs text-muted-foreground">剩余次数</p>
          </div>
        ))}
      </div>

      <TableSlot {...table} />
    </div>
  );
}
