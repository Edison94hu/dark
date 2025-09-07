import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import {
  Check,
  Key,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

type ReportMode = "realtime" | "scheduled" | "manual";

interface SystemSettings {
  province: string;
  reportMode: ReportMode;
  scheduledHours: number;
  printStandard: string;
  apiToken: string;
  lastReportTime: string;
}

export function SystemSettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [settings, setSettings] = useState<SystemSettings>({
    province: "浙江省",
    reportMode: "realtime",
    scheduledHours: 6,
    printStandard: "浙江省规范",
    apiToken: "",
    lastReportTime: "2025-09-03 14:30:25",
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const provinces = [
    "浙江省",
    "江苏省",
    "广东省",
    "上海市",
    "北京市",
    "山东省",
    "河南省",
    "四川省",
    "湖北省",
    "福建省",
  ];

  const printStandards = [
    "浙江省规范",
    "江苏省规范",
    "广东省规范",
    "上海市规范",
    "北京市规范",
    "国家标准规范",
  ];

  const reportModeOptions = [
    { value: "realtime", label: "实时上报", description: "数据产生时立即上报" },
    { value: "scheduled", label: "定时上报", description: "按设定时间间隔定时上报" },
    { value: "manual", label: "手动上报", description: "手动触发数据上报" },
  ];

  const hourOptions = Array.from({ length: 24 }, (_, i) => i + 1);

  const handleProvinceChange = (value: string) => {
    setSettings((prev) => ({ ...prev, province: value }));
  };

  const handleReportModeChange = (value: ReportMode) => {
    setSettings((prev) => ({ ...prev, reportMode: value }));
  };

  const handleScheduledHoursChange = (value: string) => {
    const hours = parseInt(value);
    if (!isNaN(hours) && hours > 0 && hours <= 24) {
      setSettings((prev) => ({ ...prev, scheduledHours: hours }));
    }
  };

  const handlePrintStandardChange = (value: string) => {
    setSettings((prev) => ({ ...prev, printStandard: value }));
  };

  const handleApiTokenChange = (value: string) => {
    setSettings((prev) => ({ ...prev, apiToken: value }));
    if (testResult) setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!settings.apiToken.trim()) {
      setTestResult("error");
      return;
    }
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const isSuccess = Math.random() > 0.3; // 70% 成功率
      setTestResult(isSuccess ? "success" : "error");
    } catch {
      setTestResult("error");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
    alert("设置保存成功！");
  };

  const handleCancel = () => {
    console.log("取消设置更改");
  };

  // Sync URL <-> state for reportMode and scheduledHours (for unique URLs)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("reportMode") as ReportMode | null;
    const hours = params.get("hours");
    const test = params.get("test");
    const tokenSet = params.get("tokenSet");
    if (mode && ["realtime", "scheduled", "manual"].includes(mode) && mode !== settings.reportMode) {
      setSettings((prev) => ({ ...prev, reportMode: mode }));
    }
    if (hours) {
      const n = parseInt(hours);
      if (!isNaN(n) && n > 0 && n <= 24 && n !== settings.scheduledHours) {
        setSettings((prev) => ({ ...prev, scheduledHours: n }));
      }
    }
    if (test === "success" || test === "error") {
      setTestResult(test as "success" | "error");
    } else if (test === "none") {
      setTestResult(null);
    }
    // tokenSet impacts only display state; don't set actual token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("reportMode", settings.reportMode);
    if (settings.reportMode === "scheduled") {
      params.set("hours", String(settings.scheduledHours));
    } else {
      params.delete("hours");
    }
    // reflect test result in URL
    if (testResult === "success" || testResult === "error") {
      params.set("test", testResult);
    } else {
      params.set("test", "none");
    }
    // reflect whether a token is set (but never include its value)
    if (settings.apiToken && settings.apiToken.trim()) {
      params.set("tokenSet", "1");
    } else {
      params.delete("tokenSet");
    }
    const to = `${location.pathname}?${params.toString()}`;
    const current = `${location.pathname}${location.search}`;
    if (to !== current) navigate(to, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.reportMode, settings.scheduledHours, settings.apiToken, testResult]);

  return (
    <div className={`${resolvedTheme === 'dark' ? 'settings-dark' : ''} h-full bg-background p-6`}>
      <div className="space-y-6 max-w-full">
        {/* 数据上报配置卡片 */}
        <div className="bg-card rounded-[var(--radius-card)] border border-border p-6" style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-industrial-blue/10 rounded-[var(--radius-input)] flex items-center justify-center">
              <Globe className="w-4 h-4 text-industrial-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">数据上报配置</h2>
              <p className="text-sm text-muted-foreground">配置数据上报方式与频率</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-w-0">
            <div className="space-y-3 min-w-0">
              <Label className="text-sm text-muted-foreground">省份地区</Label>
              <Select value={settings.province} onValueChange={handleProvinceChange}>
                <SelectTrigger className="h-12 bg-input border-border hover:border-industrial-blue focus:border-industrial-blue rounded-[var(--radius-input)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 min-w-0">
              <Label className="text-sm text-muted-foreground">上报模式</Label>
              <Select value={settings.reportMode} onValueChange={handleReportModeChange}>
                <SelectTrigger className="h-12 bg-input border-border hover:border-industrial-blue focus:border-industrial-blue rounded-[var(--radius-input)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportModeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    settings.reportMode === "realtime"
                      ? "bg-safety-green"
                      : settings.reportMode === "scheduled"
                      ? "bg-industrial-blue"
                      : "bg-orange-500"
                  }`}
                />
                <span className="text-muted-foreground">
                  当前状态：{reportModeOptions.find((opt) => opt.value === settings.reportMode)?.label}
                  {settings.reportMode === "scheduled" && ` (每${settings.scheduledHours}小时)`}
                </span>
              </div>
            </div>
          </div>

          {settings.reportMode === "scheduled" && (
            <div className="bg-muted border border-border rounded-[var(--radius-card)] p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-4 h-4 text-industrial-blue" />
                <h3 className="font-medium text-foreground">定时上报配置</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">上报间隔（小时）</Label>
                  <Select value={settings.scheduledHours.toString()} onValueChange={handleScheduledHoursChange}>
                    <SelectTrigger className="h-10 bg-input border-border hover:border-industrial-blue focus:border-industrial-blue rounded-[var(--radius-input)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hourOptions.map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour} 小时
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">下次上报预计时间</Label>
                  <div className="h-10 bg-input border border-border rounded-[var(--radius-input)] px-3 flex items-center">
                    <span className="text-sm text-muted-foreground">
                      {(() => {
                        const now = new Date();
                        const nextReport = new Date(now.getTime() + settings.scheduledHours * 60 * 60 * 1000);
                        return nextReport.toLocaleString("zh-CN", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 打印规范选择卡片 */}
        <div className="bg-card rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-safety-green/10 rounded-[var(--radius-input)] flex items-center justify-center">
              <Shield className="w-4 h-4 text-safety-green" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">打印规范选择</h2>
              <p className="text-sm text-muted-foreground">依据省市规范选择打印标准</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-md">
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">打印规范</Label>
              <Select value={settings.printStandard} onValueChange={handlePrintStandardChange}>
                <SelectTrigger className="h-12 bg-input border-border hover:border-industrial-blue focus:border-industrial-blue rounded-[var(--radius-input)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {printStandards.map((standard) => (
                    <SelectItem key={standard} value={standard}>
                      {standard}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* API 设置卡片 */}
        <div className="bg-card rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500/10 rounded-[var(--radius-input)] flex items-center justify-center">
              <Key className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">API 设置</h2>
            <div className="ml-auto flex items-center gap-2">
              {testResult === "success" && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-safety-green)]/10 border border-[var(--color-safety-green)]/20 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--color-safety-green)]" />
                  <span className="text-xs font-medium text-[var(--color-safety-green)]">连接正常</span>
                </div>
              )}
              {testResult === "error" && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-warning-red)]/10 border border-[var(--color-warning-red)]/20 rounded-full">
                  <XCircle className="w-3.5 h-3.5 text-[var(--color-warning-red)]" />
                  <span className="text-xs font-medium text-[var(--color-warning-red)]">连接异常</span>
                </div>
              )}
              {!testResult && settings.apiToken.trim() && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/70 border border-border/60 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">未验证</span>
                </div>
              )}
              {!testResult && !settings.apiToken.trim() && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-warning-red)]/10 border border-[var(--color-warning-red)]/20 rounded-full">
                  <Key className="w-3.5 h-3.5 text-[var(--color-warning-red)]" />
                  <span className="text-xs font-medium text-[var(--color-warning-red)]">未配置</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">API Token</Label>
              <div className="flex gap-3 items-center w-full max-w-full min-w-0">
                <Input
                  type="password"
                  value={settings.apiToken}
                  onChange={(e) => handleApiTokenChange(e.target.value)}
                  placeholder="请输入 API Token"
                  className="h-12 bg-input border-border hover:border-industrial-blue focus:border-industrial-blue rounded-[var(--radius-input)] flex-1 min-w-0"
                />
                <Button
                  onClick={handleTestConnection}
                  disabled={!settings.apiToken.trim() || isTestingConnection}
                  variant="outline"
                  className={`h-12 px-6 rounded-[var(--radius-button)] shrink-0 ${isTestingConnection ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isTestingConnection ? "测试中..." : "测试连接"}
                </Button>
              </div>
            </div>

            {testResult && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  testResult === "success"
                    ? "text-[var(--color-safety-green)]"
                    : "text-[var(--color-warning-red)]"
                }`}
              >
                <Check className={`w-4 h-4 ${testResult === "success" ? "" : "hidden"}`} />
                <span>
                  {testResult === "success"
                    ? "API 连接测试成功"
                    : "API 连接测试失败，请检查 Token 是否正确"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 最后上报时间卡片 */}
        <div className="bg-card rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-500/10 rounded-[var(--radius-input)] flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">最后上报时间</h2>
          </div>
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">最近一次上报时间戳</Label>
            <div className="bg-muted border border-border rounded-[var(--radius-input)] p-3">
              <span className="text-sm text-muted-foreground font-mono">{settings.lastReportTime}</span>
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="flex justify-end gap-4 pt-2">
          <Button onClick={handleCancel} variant="outline" className="h-12 px-8 rounded-[var(--radius-button)]">
            取消
          </Button>
          <Button onClick={handleSaveSettings} className="h-12 px-8 bg-industrial-blue hover:bg-industrial-blue-dark text-white rounded-[var(--radius-button)]">
            保存设置
          </Button>
        </div>
      </div>
    </div>
  );
}
