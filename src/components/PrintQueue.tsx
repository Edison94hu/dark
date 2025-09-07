import { useState } from "react";
import { Printer, Trash2, RotateCcw, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export type QueueItemStatus = "pending" | "printing" | "completed" | "failed";

export interface QueueItem {
  id: string;
  templateName: string;
  wasteType: string;
  quantity: number;
  status: QueueItemStatus;
  timestamp: string;
}

interface PrintQueueProps {
  queueItems: QueueItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onRetryItem: (id: string) => void;
}

export function PrintQueue({ 
  queueItems, 
  onDeleteItem, 
  onClearAll, 
  onRetryItem 
}: PrintQueueProps) {
  const getStatusConfig = (status: QueueItemStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          text: "排队中",
          className: "bg-blue-500/10 text-blue-600 border-blue-500/20"
        };
      case "printing":
        return {
          icon: Printer,
          text: "打印中",
          className: "bg-[--color-industrial-blue]/10 text-[--color-industrial-blue] border-[--color-industrial-blue]/20"
        };
      case "completed":
        return {
          icon: CheckCircle,
          text: "已完成",
          className: "bg-[--color-safety-green]/10 text-[--color-safety-green] border-[--color-safety-green]/20"
        };
      case "failed":
        return {
          icon: XCircle,
          text: "失败",
          className: "bg-[--color-warning-red]/10 text-[--color-warning-red] border-[--color-warning-red]/20"
        };
    }
  };

  if (queueItems.length === 0) {
    return (
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-foreground">打印队列</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Printer className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">暂无打印任务</p>
            <Button 
              variant="outline" 
              className="border-[--color-industrial-blue] text-[--color-industrial-blue] hover:bg-[--color-industrial-blue]/5"
            >
              去新建标签
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">
            打印队列 ({queueItems.length})
          </CardTitle>
          {queueItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 px-2 text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {queueItems.map((item, index) => {
            const statusConfig = getStatusConfig(item.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={item.id}>
                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/60">
                  {/* 缩略图占位 */}
                  <div className="w-12 h-8 bg-card border border-border rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-muted-foreground">标签</span>
                  </div>
                  
                  {/* 信息区域 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground truncate">
                        {item.templateName}
                      </span>
                      <Badge variant="outline" className={statusConfig.className}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.text}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.wasteType} × {item.quantity}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.timestamp}
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {item.status === "failed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRetryItem(item.id)}
                        className="h-8 w-8 p-0 text-[--color-industrial-blue] hover:bg-[--color-industrial-blue]/10"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteItem(item.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {index < queueItems.length - 1 && <Separator className="my-2" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
