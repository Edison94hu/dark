import { WifiOff, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface OfflineBannerProps {
  isOffline: boolean;
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  if (!isOffline) return null;

  return (
    <Alert className="mb-4 border-[--color-warning-red]/20 bg-[--color-warning-red]/5">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-[--color-warning-red]" />
        <WifiOff className="w-5 h-5 text-[--color-warning-red]" />
        <AlertDescription className="text-[--color-warning-red] font-medium">
          网络连接已断开，请检查网络设置
        </AlertDescription>
      </div>
    </Alert>
  );
}