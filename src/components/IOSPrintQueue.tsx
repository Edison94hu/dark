import { Clock, CheckCircle, XCircle, Trash2, RotateCcw } from "lucide-react";

export type QueueItemStatus = "pending" | "printing" | "completed" | "failed";

export interface QueueItem {
  id: string;
  templateName: string;
  wasteType: string;
  quantity: number;
  status: QueueItemStatus;
  timestamp: string;
}

interface IOSPrintQueueProps {
  queueItems: QueueItem[];
  onDeleteItem: (id: string) => void;
  onRetryItem: (id: string) => void;
}

export function IOSPrintQueue({ queueItems, onDeleteItem, onRetryItem }: IOSPrintQueueProps) {
  const getStatusConfig = (status: QueueItemStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          text: "排队中",
          color: "text-blue-600",
          bgColor: "bg-blue-100"
        };
      case "printing":
        return {
          icon: Clock,
          text: "打印中",
          color: "text-orange-600",
          bgColor: "bg-orange-100"
        };
      case "completed":
        return {
          icon: CheckCircle,
          text: "已完成",
          color: "text-green-600",
          bgColor: "bg-green-100"
        };
      case "failed":
        return {
          icon: XCircle,
          text: "失败",
          color: "text-red-600",
          bgColor: "bg-red-100"
        };
    }
  };

  if (queueItems.length === 0) {
    return (
      <div className="bg-card rounded-[var(--radius-card)] p-6 shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">打印队列</h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">暂无打印任务</p>
          <button className="px-6 py-3 bg-industrial-blue text-white rounded-[var(--radius-button)] font-semibold hover:bg-industrial-blue-dark transition-colors">
            新建标签任务
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[var(--radius-card)] p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          打印队列 ({queueItems.length})
        </h3>
        <button className="text-sm text-industrial-blue hover:text-industrial-blue-dark font-medium">
          全部清空
        </button>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {queueItems.map((item) => {
          const statusConfig = getStatusConfig(item.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-secondary rounded-[var(--radius-card)]">
              {/* 缩略图占位 */}
              <div className="w-12 h-8 bg-card border border-border rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-xs text-muted-foreground">标签</span>
              </div>
              
              {/* 信息区域 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground truncate">
                    {item.templateName}
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bgColor}`}>
                    <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                    <span className={`text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.text}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {item.wasteType} × {item.quantity}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.timestamp}
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.status === "failed" && (
                  <button
                    onClick={() => onRetryItem(item.id)}
                    className="p-2 text-industrial-blue hover:bg-industrial-blue/10 rounded-[var(--radius-button)] transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-2 text-warning-red hover:bg-warning-red/10 rounded-[var(--radius-button)] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
