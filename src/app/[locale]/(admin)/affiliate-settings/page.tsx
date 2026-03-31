import AffiliateSettingsForm from "./components/affiliate-settings-form";

export default async function AffiliateSettingsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">邀请奖励设置</h1>
        <p className="text-muted-foreground mt-2">
          自定义用户邀请奖励的类型、金额和触发条件
        </p>
      </div>
      <AffiliateSettingsForm />
    </div>
  );
}
