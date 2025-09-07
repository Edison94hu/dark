import { FileText, ScanLine, Printer } from "lucide-react";

interface QuickActionProps {
  onSelectTemplate: () => void;
  onScanCode: () => void;
  onBatchPrint: () => void;
}

export function iOSQuickActions({ onSelectTemplate, onScanCode, onBatchPrint }: QuickActionProps) {
  const actions = [
    {
      icon: FileText,
      label: "选择模板",
      description: "从预设模板中选择",
      color: "text-industrial-blue",
      lightColor: "bg-industrial-blue/10",
      onClick: onSelectTemplate
    },
    {
      icon: ScanLine,
      label: "扫码识别",
      description: "扫描二维码或条形码",
      color: "text-safety-green",
      lightColor: "bg-safety-green/10",
      onClick: onScanCode
    },
    {
      icon: Printer,
      label: "批量打印",
      description: "批量打印多个标签",
      color: "text-orange-500",
      lightColor: "bg-orange-100",
      onClick: onBatchPrint
    }
  ];

  return (
    <div className="bg-card rounded-[var(--radius-card)] p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">快速操作</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="flex flex-col items-center p-6 bg-secondary rounded-[var(--radius-card)] hover:bg-accent transition-all duration-200 hover:shadow-md"
            >
              <div className={`w-16 h-16 ${action.lightColor} rounded-2xl flex items-center justify-center mb-3`}>
                <Icon className={`w-8 h-8 ${action.color}`} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground mb-1">{action.label}</div>
                <div className="text-sm text-muted-foreground">{action.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
