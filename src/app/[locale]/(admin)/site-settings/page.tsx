import SiteSettingsForm from "./components/site-settings-form";

export default async function SiteSettingsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">站点设置</h1>
        <p className="text-muted-foreground mt-2">管理站点的全局配置</p>
      </div>
      <SiteSettingsForm />
    </div>
  );
}
