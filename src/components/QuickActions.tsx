import { Plus, ScanLine, FileText, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface QuickActionsProps {
  onNewLabel: () => void;
  onScanCode: () => void;
  onSelectTemplate: () => void;
  onBatchPrint: () => void;
}

export function QuickActions({ 
  onNewLabel, 
  onScanCode, 
  onSelectTemplate, 
  onBatchPrint 
}: QuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: "新建标签",
      description: "创建新的危废标签",
      onClick: onNewLabel,
      color: "bg-[--color-industrial-blue] hover:bg-[--color-industrial-blue-dark]"
    },
    {
      icon: ScanLine,
      label: "扫码识别",
      description: "扫描二维码或拍照识别",
      onClick: onScanCode,
      color: "bg-[--color-safety-green] hover:bg-green-600"
    },
    {
      icon: FileText,
      label: "选择模板",
      description: "使用预设标签模板",
      onClick: onSelectTemplate,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: Printer,
      label: "批量打印",
      description: "批量打印多个标签",
      onClick: onBatchPrint,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <Card className="shadow-sm border-slate-200/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-slate-900">快速操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.onClick}
                className={`${action.color} h-20 flex flex-col items-center justify-center gap-2 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}