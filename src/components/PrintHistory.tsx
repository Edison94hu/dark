import { useState } from "react";
import { Search, Filter, History, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

export interface HistoryItem {
  id: string;
  wasteType: string;
  wasteCode: string;
  quantity: number;
  printDate: string;
  batchNumber: string;
  operator: string;
  status: "success" | "failed";
}

interface PrintHistoryProps {
  historyItems: HistoryItem[];
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
  onExport: () => void;
}

export function PrintHistory({ 
  historyItems, 
  onSearch, 
  onFilter, 
  onExport 
}: PrintHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilter = (filter: string) => {
    setFilterType(filter);
    onFilter(filter);
  };

  const filterOptions = [
    { value: "all", label: "全部记录" },
    { value: "today", label: "今日" },
    { value: "week", label: "本周" },
    { value: "month", label: "本月" }
  ];

  const displayItems = historyItems.slice(0, 10); // 显示最近10条

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <History className="w-5 h-5" />
            历史记录
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-8 px-2 text-muted-foreground"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 搜索和筛选 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索批次号、危废代码..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-10 bg-input border-border"
            />
          </div>
          <Select value={filterType} onValueChange={handleFilter}>
            <SelectTrigger className="w-32 h-10 bg-input border-border">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 历史记录列表 */}
        {displayItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
              <History className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">暂无历史记录</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-accent/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {item.wasteType}
                    </span>
                    <Badge
                      variant={item.status === "success" ? "default" : "destructive"}
                      className={item.status === "success" 
                        ? "bg-[--color-safety-green] text-white" 
                        : "bg-[--color-warning-red] text-white"
                      }
                    >
                      {item.status === "success" ? "成功" : "失败"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>代码: {item.wasteCode} | 数量: {item.quantity}</div>
                    <div>批次: {item.batchNumber} | 经办: {item.operator}</div>
                    <div>{item.printDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 查看更多 */}
        {historyItems.length > 10 && (
          <div className="text-center">
            <Button variant="ghost" className="text-sm text-[--color-industrial-blue]">
              查看更多记录
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
