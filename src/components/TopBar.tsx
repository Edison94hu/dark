import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export type DeviceStatus = "connected" | "disconnected";

export function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());



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

  // Removed theme toggle functionality - using light mode only

  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Left side - Title */}
      <div className="flex-1">
        <div className="flex flex-col">
          {/* 主标题 - 动态科技渐变效果 */}
          <h1 className="text-2xl font-bold brand-gradient-text tracking-wide transform hover:scale-105 transition-transform duration-300">
            危司通
          </h1>
          {/* 副标题 - 工业蓝高亮 */}
          <p className="text-sm font-medium text-industrial-blue tracking-[0.2em] opacity-80 pl-0.5 hover:opacity-100 transition-opacity duration-300">
            WastePass
          </p>
        </div>

      </div>

      {/* Center - Real-time Date & Time */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-industrial-blue opacity-70" />
          <div className="flex items-center gap-4">
            <div className="text-lg font-mono font-semibold text-foreground tracking-wide">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Removed theme toggle */}
      <div className="flex-1 flex items-center justify-end">
        {/* Space reserved for future controls */}
      </div>
    </div>
  );
}