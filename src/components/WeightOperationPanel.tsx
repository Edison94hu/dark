import { useState, useRef, useEffect } from "react";
import { Lock, Unlock, Printer, Scale, Check, X, Calendar, Globe, Eraser } from "lucide-react";
import { LabelPreview } from "./LabelPreview";

export type WeightUnit = "KG" | "T";
export type LabelSize = "100*100" | "100*80" | "100*70" | "100*60" | "150*150" | "200*200";
export type DeviceStatus = "connected" | "disconnected";

interface WasteTypeData {
  id: string;
  name: string;
  code: string;
  frequency: number;
}

interface WeightOperationPanelProps {
  weight: string;
  weightUnit: WeightUnit;
  labelSize: LabelSize;
  isWeightLocked: boolean;
  selectedWasteType: string | null;
  selectedWasteData: WasteTypeData | null;
  printerStatus: DeviceStatus;
  scaleStatus: DeviceStatus;
  onWeightChange: (weight: string) => void;
  onWeightUnitChange: (unit: WeightUnit) => void;
  onLabelSizeChange: (size: LabelSize) => void;
  onWeightLockToggle: () => void;
  onPrint: () => void;
  onTare: () => void;
  entryMode?: "normal" | "backfill";
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onEntryModeChange?: (mode: "normal" | "backfill") => void;
  apiStatus?: "ok" | "error" | "unknown";
  lastTareAt?: string | null;
  justTared?: boolean;
}

export function WeightOperationPanel({
  weight,
  weightUnit,
  labelSize,
  isWeightLocked,
  selectedWasteType,
  selectedWasteData,
  printerStatus,
  scaleStatus,
  onWeightChange,
  onWeightUnitChange,
  onLabelSizeChange,
  onWeightLockToggle,
  onPrint,
  onTare,
  entryMode = "normal",
  selectedDate,
  onDateChange,
  onEntryModeChange,
  apiStatus = "unknown",
  lastTareAt = null,
  justTared = false
}: WeightOperationPanelProps) {
  const [localWeight, setLocalWeight] = useState(weight);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalWeight(weight);
  }, [weight]);

  const handleWeightInputChange = (value: string) => {
    // Only allow numbers and one decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized;
    
    setLocalWeight(finalValue);
    onWeightChange(finalValue);
  };

  const getDisplayWeight = () => {
    if (!weight) return "";
    const weightNum = parseFloat(weight);
    return weightUnit === "T" ? 
      (weightNum / 1000).toFixed(3) : 
      weightNum.toFixed(2);
  };

  const getDisplayUnit = () => {
    return weightUnit;
  };

  const canPrint = selectedWasteType && weight && parseFloat(weight) > 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    });
  };

  const getStatusColor = (status: DeviceStatus) => {
    return status === "connected" ? "text-safety-green" : "text-neutral-gray";
  };

  const getStatusText = (status: DeviceStatus) => {
    return status === "connected" ? "已连接" : "未连接";
  };

  const getApiColor = (status: WeightOperationPanelProps["apiStatus"]) => {
    switch (status) {
      case "ok":
        return "text-safety-green";
      case "error":
        return "text-warning-red";
      default:
        return "text-muted-foreground";
    }
  };

  const getApiText = (status: WeightOperationPanelProps["apiStatus"]) => {
    switch (status) {
      case "ok":
        return "正常";
      case "error":
        return "异常";
      default:
        return "未知";
    }
  };

  const formatTimeHM = (iso?: string | null) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return "—";
    }
  };

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">

      {/* Main Content Area - 按照参考图片重新布局，标签预览更接近正方形 */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        
        {/* Center: Large Label Preview Area - 完全填充可用空间 */}
          <div className="flex-1 bg-muted/20 rounded-lg border-2 border-border/30 p-1 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full min-h-0 bg-white rounded-md border-2 border-slate-600 shadow-lg" style={{ aspectRatio: '1/1' }}>
            <LabelPreview
              wasteType={selectedWasteData ? {
                id: selectedWasteData.id,
                name: selectedWasteData.name,
                code: selectedWasteData.code,
                frequency: selectedWasteData.frequency
              } : null}
              weight={weight}
              weightUnit={weightUnit}
              labelSize={labelSize}
            />
          </div>
        </div>

        {/* Right Side: Narrow Control Panel (200px) - 参考图片右侧的窄控制面板 */}
        <div className="w-[200px] flex flex-col gap-3">
          
          {/* 模式选择区域 - 移动到右侧顶部 */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex flex-col gap-2">
              {/* Mode Toggle */}
              <div className="flex bg-muted rounded-lg p-0.5">
                <button
                  onClick={() => onEntryModeChange?.("normal")}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-all duration-300
                    ${entryMode === "normal" 
                      ? 'bg-industrial-blue text-white shadow-md shadow-industrial-blue/20 transform scale-[1.01]' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <span>正常</span>
                </button>
                <button
                  onClick={() => onEntryModeChange?.("backfill")}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-all duration-300
                    ${entryMode === "backfill" 
                      ? 'bg-warning-red text-white shadow-md shadow-warning-red/20 transform scale-[1.01]' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <span>补录</span>
                </button>
              </div>

              {/* Mode Description and Date Input */}
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground">
                  {entryMode === "normal" 
                    ? "实时录入" 
                    : "补录数据"
                  }
                </div>
                
                {/* Date Input for Backfill Mode */}
                {entryMode === "backfill" && (
                  <input
                    type="date"
                    value={selectedDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => onDateChange?.(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="bg-input-background border border-border text-foreground rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-warning-red/50"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* 危废选择 */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-foreground font-semibold text-sm">危废选择</h4>
              <div className={`w-2 h-2 rounded-full ${selectedWasteType ? 'bg-safety-green' : 'bg-muted'}`}></div>
            </div>
            
            {selectedWasteType ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-industrial-blue truncate">
                  {selectedWasteType}
                </div>
                {selectedWasteData && (
                  <div className="text-xs text-muted-foreground">
                    {selectedWasteData.code}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                请从左侧选择危废类型
              </div>
            )}
          </div>

          {/* 标签设置 */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <h4 className="text-foreground font-semibold text-sm mb-2">标签设置</h4>
            <select
              value={labelSize}
              onChange={(e) => onLabelSizeChange(e.target.value as LabelSize)}
              className="w-full bg-input border border-border text-foreground py-2 px-3 rounded-md text-sm focus:border-industrial-blue focus:outline-none"
            >
              <option value="100*100">100×100 mm</option>
              <option value="100*80">100×80 mm</option>
              <option value="100*70">100×70 mm</option>
              <option value="100*60">100×60 mm</option>
              <option value="150*150">150×150 mm</option>
              <option value="200*200">200×200 mm</option>
            </select>
          </div>

          {/* 操作状态 */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <h4 className="text-foreground font-semibold text-sm mb-2">操作状态</h4>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sm text-foreground">待完善信息</div>
              <div className="text-xs text-muted-foreground ml-auto">
                {entryMode === "normal" ? "正常" : "补录"}
              </div>
            </div>

            <div className="space-y-2">
              {/* 去皮状态 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eraser className={`w-4 h-4 ${lastTareAt ? 'text-safety-green' : 'text-muted-foreground'}`} />
                  <span className="text-sm text-foreground">去皮</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {lastTareAt ? `上次 ${formatTimeHM(lastTareAt)}` : '未去皮'}
                </span>
              </div>

              {/* API 状态 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className={`w-4 h-4 ${getApiColor(apiStatus)}`} />
                  <span className="text-sm text-foreground">API 状态</span>
                </div>
                <span className={`text-sm ${getApiColor(apiStatus)} font-medium`}>
                  {getApiText(apiStatus)}
                </span>
              </div>

              {/* 打印机状态 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className={`w-4 h-4 ${getStatusColor(printerStatus)}`} />
                  <span className="text-sm text-foreground">打印机</span>
                </div>
                <span className={`text-sm ${getStatusColor(printerStatus)} font-medium`}>
                  {getStatusText(printerStatus)}
                </span>
              </div>

              {/* 称重机状态 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className={`w-4 h-4 ${getStatusColor(scaleStatus)}`} />
                  <span className="text-sm text-foreground">称重机</span>
                </div>
                <span className={`text-sm ${getStatusColor(scaleStatus)} font-medium`}>
                  {getStatusText(scaleStatus)}
                </span>
              </div>
            </div>
          </div>



        </div>

      </div>

      {/* 横向重量录入区域 - 贯穿整个右侧宽度 */}
      <div className="flex-shrink-0 bg-muted/30 rounded-lg p-4 border border-border/50 mb-2">
        <div className="flex items-center gap-4">
          
          {/* 重量输入区域 - 左侧 */}
          <div className="flex-1 flex items-center gap-4">
            <h4 className="text-foreground font-semibold text-sm whitespace-nowrap">重量录入</h4>
            
            {/* 重量输入框和单位 */}
            <div className="flex-1 relative max-w-xs">
              <input
                ref={inputRef}
                type="text"
                value={isWeightLocked ? getDisplayWeight() : localWeight}
                onChange={(e) => !isWeightLocked && handleWeightInputChange(e.target.value)}
                className={`w-full text-center text-xl font-mono py-2.5 px-4 rounded-lg transition-all duration-200 ${
                  isWeightLocked 
                    ? 'bg-orange-50 border-2 border-orange-300 cursor-not-allowed text-orange-600' 
                    : 'bg-input border-2 border-border focus:border-industrial-blue focus:outline-none text-foreground'
                }`}
                placeholder="0.00"
                disabled={isWeightLocked}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {getDisplayUnit()}
              </div>
              
              {/* 锁定状态覆盖层 */}
              {isWeightLocked && (
                <div className="absolute inset-0 bg-orange-100/30 rounded-lg pointer-events-none flex items-center justify-center">
                  <div className="absolute top-1 left-2 flex items-center gap-1 bg-orange-200/80 px-1.5 py-0.5 rounded-md">
                    <Lock className="w-3 h-3 text-orange-700" />
                    <span className="text-xs font-medium text-orange-700">已锁定</span>
                  </div>
                </div>
              )}

              {/* 去皮即时反馈徽标（短暂显示） */}
              {justTared && !isWeightLocked && (
                <div className="absolute -bottom-2 left-2 translate-y-full">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-safety-green/15 border border-safety-green/30 text-safety-green rounded-full shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium leading-none">已去皮</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KG/T 切换按钮 - 中间 */}
          <div className="flex gap-2">
            <button
              onClick={() => onWeightUnitChange("KG")}
              className={`py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 min-w-[60px] ${
                weightUnit === "KG"
                  ? 'bg-industrial-blue text-white'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              KG
            </button>
            <button
              onClick={() => onWeightUnitChange("T")}
              className={`py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 min-w-[60px] ${
                weightUnit === "T"
                  ? 'bg-industrial-blue text-white'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              T
            </button>
          </div>

          {/* 去皮按钮 */}
          <button
            onClick={onTare}
            disabled={isWeightLocked}
            className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 min-h-[48px] whitespace-nowrap border ${
              isWeightLocked
                ? 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-60'
                : 'bg-background text-foreground border-border hover:bg-accent'
            }`}
            title={isWeightLocked ? '解锁后可去皮' : '去皮（将当前读数置零）'}
          >
            <span>去皮</span>
          </button>

          {/* 锁定重量按钮 - 右侧 */}
          <button
            onClick={onWeightLockToggle}
            className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 min-h-[48px] whitespace-nowrap ${
              isWeightLocked 
                ? 'bg-orange-400 text-white hover:bg-orange-500' 
                : 'bg-muted text-foreground hover:bg-accent'
            }`}
          >
            {isWeightLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{isWeightLocked ? "解锁重量" : "锁定重量"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Print Button - 压缩高度 */}
      <div className="flex-shrink-0 pb-1">
        <button
          onClick={onPrint}
          disabled={!canPrint}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 relative ${
            canPrint
              ? 'bg-industrial-blue text-white hover:bg-industrial-blue-dark shadow-md shadow-industrial-blue/15 hover:shadow-industrial-blue/25 active:scale-[0.99]'
              : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
          }`}
        >
          <Printer className={`w-4 h-4 transition-all duration-200 ${
            canPrint 
              ? 'text-white' 
              : 'text-muted-foreground'
          }`} />
          
          <span className="font-medium text-sm">
            {entryMode === "backfill" ? "补录并打印标签" : "打印标签"}
          </span>
          
          {/* Simple status indicator */}
          {canPrint && (
            <div className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-white/80" />
          )}
        </button>

        {!canPrint && (
          <p className="text-center text-muted-foreground text-xs mt-1">
            请选择危废类型并输入重量后再打印
          </p>
        )}
      </div>

    </div>
  );
}
