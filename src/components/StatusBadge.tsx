import { Bluetooth, BluetoothConnected, BluetoothSearching } from "lucide-react";
import { Badge } from "./ui/badge";

export type BluetoothStatus = "connected" | "searching" | "disconnected";

interface StatusBadgeProps {
  status: BluetoothStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: BluetoothStatus) => {
    switch (status) {
      case "connected":
        return {
          icon: BluetoothConnected,
          text: "已连接",
          className: "bg-[--color-safety-green]/10 text-[--color-safety-green] border-[--color-safety-green]/20"
        };
      case "searching":
        return {
          icon: BluetoothSearching,
          text: "搜索中",
          className: "bg-[--color-industrial-blue]/10 text-[--color-industrial-blue] border-[--color-industrial-blue]/20"
        };
      case "disconnected":
        return {
          icon: Bluetooth,
          text: "未连接",
          className: "bg-[--color-warning-red]/10 text-[--color-warning-red] border-[--color-warning-red]/20"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`inline-flex items-center gap-2 px-3 py-2 h-10 text-sm font-medium ${config.className}`}>
      <Icon className="w-4 h-4" />
      <span>{config.text}</span>
    </Badge>
  );
}