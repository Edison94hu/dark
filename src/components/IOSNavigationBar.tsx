import { Building, Bluetooth, BluetoothConnected, BluetoothSearching } from "lucide-react";
import { BluetoothStatus } from "./StatusBadge";

interface IOSNavigationBarProps {
  bluetoothStatus: BluetoothStatus;
  companyName: string;
}

export function IOSNavigationBar({ bluetoothStatus, companyName }: IOSNavigationBarProps) {
  const getBluetoothIcon = (status: BluetoothStatus) => {
    switch (status) {
      case "connected":
        return <BluetoothConnected className="w-5 h-5 text-industrial-blue" />;
      case "searching":
        return <BluetoothSearching className="w-5 h-5 text-industrial-blue animate-pulse" />;
      case "disconnected":
        return <Bluetooth className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: BluetoothStatus) => {
    switch (status) {
      case "connected":
        return "已连接";
      case "searching":
        return "搜索中";
      case "disconnected":
        return "未连接";
    }
  };

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left side - Logo and Product Name */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-[var(--radius-button)] bg-gradient-to-br from-industrial-blue to-industrial-blue-dark flex items-center justify-center shadow-sm">
          <Building className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">危废标签打印</h1>
          <p className="text-xs text-muted-foreground">Hazardous Waste Label Printing</p>
        </div>
      </div>

      {/* Right side - Company and Bluetooth Status */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-base font-medium text-foreground">{companyName}</div>
          <div className="text-sm text-muted-foreground">企业管理系统</div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-[var(--radius-input)]">
          {getBluetoothIcon(bluetoothStatus)}
          <span className="text-sm font-medium text-muted-foreground">
            {getStatusText(bluetoothStatus)}
          </span>
        </div>
      </div>
    </div>
  );
}
