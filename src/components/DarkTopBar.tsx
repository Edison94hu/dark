import { useState, useEffect } from "react";
import { Printer, Scale, Clock } from "lucide-react";

export type DeviceStatus = "connected" | "disconnected";

interface DeviceStatusProps {
  printerStatus: DeviceStatus;
  scaleStatus: DeviceStatus;
}

export function DarkTopBar({ printerStatus, scaleStatus }: DeviceStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  const getStatusColor = (status: DeviceStatus) => {
    return status === "connected" ? "text-safety-green" : "text-neutral-gray";
  };

  const getStatusText = (status: DeviceStatus) => {
    return status === "connected" ? "已连接" : "未连接";
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Left side - Title */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-white">危废采集</h1>
        <p className="text-sm text-gray-400">Hazardous Waste Collection</p>
      </div>

      {/* Center - Real-time Date & Time */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-industrial-blue opacity-70" />
          <div className="flex items-center gap-4">
            <div className="text-lg font-mono font-semibold text-white tracking-wide">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-gray-400 font-medium">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Device Status */}
      <div className="flex-1 flex items-center justify-end gap-6">
        {/* Printer Status */}
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg">
          <Printer className={`w-5 h-5 ${getStatusColor(printerStatus)}`} />
          <div className="text-right">
            <div className="text-sm font-medium text-white">打印机</div>
            <div className={`text-xs ${getStatusColor(printerStatus)}`}>
              {getStatusText(printerStatus)}
            </div>
          </div>
        </div>

        {/* Scale Status */}
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg">
          <Scale className={`w-5 h-5 ${getStatusColor(scaleStatus)}`} />
          <div className="text-right">
            <div className="text-sm font-medium text-white">称重机</div>
            <div className={`text-xs ${getStatusColor(scaleStatus)}`}>
              {getStatusText(scaleStatus)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}