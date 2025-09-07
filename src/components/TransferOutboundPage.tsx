import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  QrCode,
  ScanLine,
  Package,
  TruckIcon,
  Trash,
  FileText,
  Calendar,
  Weight,
  Scan,
  AlertTriangle,
  Clock,
  Building,
  Trash2,
  X,
  CheckCircle,
  Plus,
  ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// 扫描到的危废物品数据接口
interface ScannedWasteItem {
  id: string;
  qrCode: string;
  wasteName: string;
  wasteCategory: string;
  weight: string;
  unit: string;
  scanTime: string;
  facilityCode: string;
}

// 转移单据接口
interface TransferRecord {
  id: string;
  transferNo: string;
  createTime: string;
  status: "待确认" | "已确认" | "运输中" | "已完成";
  itemCount: number;
  totalWeight: string;
  receiver: string;
  transportCompany: string;
}

export function TransferOutboundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // 已扫描的危废物品列表
  const [scannedItems, setScannedItems] = useState<ScannedWasteItem[]>([
    {
      id: "1",
      qrCode: "DW001-20241203-001",
      wasteName: "废矿物油与含矿物油废物",
      wasteCategory: "HW08",
      weight: "25.60",
      unit: "KG",
      scanTime: "14:23:15",
      facilityCode: "HZ001"
    },
    {
      id: "2", 
      qrCode: "DW002-20241203-002",
      wasteName: "废酸",
      wasteCategory: "HW34",
      weight: "12.30",
      unit: "KG",
      scanTime: "14:21:42",
      facilityCode: "HZ001"
    }
  ]);

  // 转移记录历史
  const [transferRecords] = useState<TransferRecord[]>([
    {
      id: "1",
      transferNo: "TO202412030001",
      createTime: "2024-12-03 14:30:00",
      status: "运输中",
      itemCount: 5,
      totalWeight: "142.50",
      receiver: "华东处置中心",
      transportCompany: "安全运输有限公司"
    },
    {
      id: "2",
      transferNo: "TO202412020001",
      createTime: "2024-12-02 10:15:00",
      status: "已完成",
      itemCount: 3,
      totalWeight: "87.20",
      receiver: "江苏环保处置",
      transportCompany: "绿色运输公司"
    }
  ]);

  // 界面状态
  const [activeTab, setActiveTab] = useState<"scan" | "records">("scan");
  const [isScanning, setIsScanning] = useState(false);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [manualQrCode, setManualQrCode] = useState("");
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 模拟二维码扫描
  const handleQrScan = (qrCode: string) => {
    // 检查重复扫描
    const isDuplicate = scannedItems.some(item => item.qrCode === qrCode);
    if (isDuplicate) {
      alert("⚠️ 警告：该二维码已经扫描过了！");
      return;
    }

    // 模拟从二维码获取危废信息
    const wasteCategories = ["HW08", "HW34", "HW35", "HW06", "HW22"];
    const wasteNames = [
      "废矿物油与含矿物油废物",
      "废酸",
      "废碱", 
      "废有机溶剂与含有机溶剂废物",
      "含重金属废物"
    ];
    
    const randomCategory = wasteCategories[Math.floor(Math.random() * wasteCategories.length)];
    const randomName = wasteNames[Math.floor(Math.random() * wasteNames.length)];

    const mockWasteData = {
      qrCode,
      wasteName: randomName,
      wasteCategory: randomCategory, 
      weight: (Math.random() * 50 + 5).toFixed(2),
      unit: "KG",
      scanTime: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      facilityCode: "HZ001"
    };

    const newItem: ScannedWasteItem = {
      id: Date.now().toString(),
      ...mockWasteData
    };

    setScannedItems(prev => [newItem, ...prev]);
    
    // 模拟震动反馈（在真实设备上有效）
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    console.log("✅ 扫描成功:", qrCode);
    
    // 显示扫描成功反馈
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1000);
  };

  // 手动输入二维码
  const handleManualInput = () => {
    if (manualQrCode.trim()) {
      handleQrScan(manualQrCode.trim());
      setManualQrCode("");
      setManualInputMode(false);
    }
  };

  // 删除单个物品
  const handleDeleteItem = (id: string) => {
    setScannedItems(prev => prev.filter(item => item.id !== id));
  };

  // 清空所有物品
  const handleClearAll = () => {
    if (confirm("⚠️ 确定要清空所有已扫描的物品吗？")) {
      setScannedItems([]);
    }
  };

  // 批量出库操作
  const handleBatchOutbound = () => {
    if (scannedItems.length === 0) {
      alert("❌ 请先扫描需要出库的危废物品");
      return;
    }
    setShowConfirmDialog(true);
    navigate(`/devices/scan?confirm=1${location.search && !location.search.includes('confirm=') ? '&' + location.search.slice(1) : ''}`);
  };

  // 确认出库
  const confirmOutbound = () => {
    console.log("🚚 批量出库操作:", scannedItems);
    
    // 模拟出库成功
    alert(`✅ 转移出库操作成功！\n\n📦 共处理 ${scannedItems.length} 项物品\n⚖️ 总重量：${getTotalWeight()} KG\n🏭 操作人员：张操作员\n⏰ 操作时间：${new Date().toLocaleString('zh-CN')}`);
    
    setScannedItems([]);
    setShowConfirmDialog(false);
  };

  // 计算总重量
  const getTotalWeight = () => {
    return scannedItems.reduce((total, item) => total + parseFloat(item.weight), 0).toFixed(2);
  };

  // 获取危废类别颜色
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "HW08": "text-warning-red bg-warning-red/10 border-warning-red/20",
      "HW34": "text-orange-600 bg-orange-100 border-orange-200", 
      "HW35": "text-purple-600 bg-purple-100 border-purple-200",
      "HW06": "text-blue-600 bg-blue-100 border-blue-200",
      "HW22": "text-green-600 bg-green-100 border-green-200"
    };
    return colors[category] || "text-neutral-gray bg-muted border-border";
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "待确认": "text-orange-600 bg-orange-100 border-orange-200",
      "已确认": "text-blue-600 bg-blue-100 border-blue-200",
      "运输中": "text-industrial-blue bg-industrial-blue/10 border-industrial-blue/20",
      "已完成": "text-safety-green bg-safety-green/10 border-safety-green/20"
    };
    return colors[status] || "text-neutral-gray bg-muted border-border";
  };

  // Sync from URL: tab + manual input + confirm dialog
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'devices') {
      const sub = parts[1];
      const next = sub === 'records' ? 'records' : 'scan';
      setActiveTab((prev) => (prev === next ? prev : next));
    }
    const params = new URLSearchParams(location.search);
    const manual = params.get('manual') === '1';
    const confirm = params.get('confirm') === '1';
    if (manual !== manualInputMode) setManualInputMode(manual);
    if (confirm !== showConfirmDialog) setShowConfirmDialog(confirm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // Reflect state to URL
  useEffect(() => {
    const base = activeTab === 'records' ? '/devices/records' : '/devices/scan';
    const params = new URLSearchParams(location.search);
    if (manualInputMode) params.set('manual', '1'); else params.delete('manual');
    if (showConfirmDialog) params.set('confirm', '1'); else params.delete('confirm');
    const next = `${base}?${params.toString()}`.replace(/\?$/, '');
    const current = `${location.pathname}${location.search}`;
    if (next !== current) navigate(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, manualInputMode, showConfirmDialog]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page Header - 适配1024×768 */}
      <div className="flex-shrink-0 bg-secondary/60 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-input)] bg-gradient-to-br from-industrial-blue/10 to-safety-green/10 flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-industrial-blue" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-foreground">危废转移出库</h1>
              <p className="text-muted-foreground text-sm">扫描二维码识别危废物品并批量出库</p>
            </div>
          </div>
          
          {/* 标签页切换 */}
          <div className="flex bg-muted rounded-[var(--radius-input)] p-1">
            <button
              onClick={() => {
                setActiveTab("scan");
                if (!location.pathname.startsWith('/devices/scan')) navigate(`/devices/scan${location.search || ''}`);
              }}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === "scan"
                  ? 'bg-industrial-blue text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Scan className="w-4 h-4 inline mr-2" />
              扫描出库
            </button>
            <button
              onClick={() => {
                setActiveTab("records");
                if (!location.pathname.startsWith('/devices/records')) navigate(`/devices/records${location.search || ''}`);
              }}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === "records"
                  ? 'bg-industrial-blue text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              转移记录
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "scan" ? (
          // 扫描出库界面
          <div className="h-full p-6">
            <div className="h-full flex gap-6">
              
              {/* 左侧扫描区域 (38%) - 适配1024宽度 */}
              <div className="w-[38%] bg-secondary/40 rounded-[var(--radius-card)] p-6 flex flex-col sticky top-6 self-start">
                {/* 扫描区域标题 */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-[var(--radius-input)] bg-gradient-to-br from-industrial-blue/10 to-safety-green/10 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <QrCode className="w-8 h-8 text-industrial-blue" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground mb-1">扫描二维码</h2>
                  <p className="text-muted-foreground text-sm">将危废物品二维码对准扫描框</p>
                </div>

                {/* 相机预览区域 - 适配768高度 */}
                <div className="flex-1 bg-card/60 rounded-[var(--radius-card)] border-2 border-dashed border-border/50 flex flex-col items-center justify-center relative mb-4">
                  {/* 扫描框指示 */}
                  <div className="relative w-40 h-40 mb-4">
                    <div className="w-full h-full border-4 border-industrial-blue rounded-[var(--radius-card)] relative overflow-hidden bg-card">
                      {/* 十字准线 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <ScanLine className="w-12 h-12 text-industrial-blue animate-pulse" />
                          {/* 扫描动画线 */}
                          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-safety-green to-transparent ${
                            scanningEnabled ? 'animate-pulse' : ''
                          }`}></div>
                        </div>
                      </div>
                      
                      {/* 四个角的指示框 */}
                      <div className="absolute top-2 left-2 w-5 h-5 border-l-2 border-t-2 border-industrial-blue"></div>
                      <div className="absolute top-2 right-2 w-5 h-5 border-r-2 border-t-2 border-industrial-blue"></div>
                      <div className="absolute bottom-2 left-2 w-5 h-5 border-l-2 border-b-2 border-industrial-blue"></div>
                      <div className="absolute bottom-2 right-2 w-5 h-5 border-r-2 border-b-2 border-industrial-blue"></div>
                    </div>
                    
                    {/* 扫描状态指示 */}
                    {scanningEnabled && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-2 px-2 py-1 bg-safety-green/10 text-safety-green rounded-full">
                          <div className="w-2 h-2 bg-safety-green rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium">
                            {isScanning ? "识别中..." : "扫描中..."}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm mb-1">将二维码对准扫描框进行识别</p>
                    <p className="text-xs">确保二维码清晰可见且光线充足</p>
                  </div>
                </div>

                {/* 手动输入区域 - 紧凑布局 */}
                <div className="space-y-3">
                  {!manualInputMode ? (
                    <Button
                      onClick={() => setManualInputMode(true)}
                      variant="outline"
                      className="w-full h-10 border-industrial-blue/30 text-industrial-blue hover:bg-industrial-blue/10"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      手动输入二维码
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={manualQrCode}
                          onChange={(e) => setManualQrCode(e.target.value)}
                          placeholder="输入二维码内容"
                          className="flex-1 h-10"
                          onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
                        />
                        <Button
                          onClick={handleManualInput}
                          disabled={!manualQrCode.trim()}
                          className="h-10 px-4 bg-industrial-blue hover:bg-industrial-blue-dark text-white"
                        >
                          确认
                        </Button>
                      </div>
                      <Button
                        onClick={() => {
                          setManualInputMode(false);
                          setManualQrCode("");
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full h-8"
                      >
                        取消
                      </Button>
                    </div>
                  )}
                  
                  {/* 模拟扫描按钮 */}
                  <Button
                    onClick={() => handleQrScan(`DW${Date.now().toString().slice(-6)}-${new Date().toISOString().split('T')[0]}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`)}
                    className="w-full h-10 bg-safety-green hover:bg-safety-green/90 text-white rounded-[var(--radius-button)]"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    模拟扫描（测试用）
                  </Button>
                </div>
              </div>

              {/* 右侧数据展示区域 (62%) */}
              <div className="w-[62%] bg-secondary/40 rounded-[var(--radius-card)] p-6 flex flex-col relative">

                {/* 标题区域 */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">危废物品清单</h3>
                  <div className="flex items-center gap-3">
                    {scannedItems.length > 0 && (
                      <Button
                        onClick={handleClearAll}
                        variant="outline"
                        size="sm"
                        className="border-warning-red/30 text-warning-red hover:bg-warning-red/10"
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        清空列表
                      </Button>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted/60 text-muted-foreground rounded-full text-sm">
                      <Clock className="w-3 h-3" />
                      <span>实时更新</span>
                    </div>
                  </div>
                </div>

                {/* 列表区域和操作区域分开 */}
                <div className="flex-1 min-h-0 flex flex-col">
                  {/* 清单滚动区域 */}
                  <div className="flex-1 overflow-auto space-y-2 min-h-0">
                  {scannedItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center text-muted-foreground h-full min-h-[200px]">
                      <div>
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="mb-1">暂无扫描物品</p>
                        <p className="text-sm">请使用左侧扫描区域扫描危废物品二维码</p>
                      </div>
                    </div>
                  ) : (
                    scannedItems.map((item) => (
                      <div key={item.id} className="bg-card rounded-[var(--radius-card)] p-2 border border-border/30 hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{item.wasteName}</div>
                            <div className="text-xs text-muted-foreground font-mono truncate">编号: {item.qrCode}</div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Weight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-semibold">{item.weight} {item.unit}</span>
                          </div>
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            variant="outline"
                            size="sm"
                            className="border-warning-red/30 text-warning-red hover:bg-warning-red/10 shrink-0 h-8 w-8 p-0 rounded-[var(--radius-button)]"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* 底部操作面板 - 固定在底部 */}
                <div className="flex-shrink-0 mt-4 mb-6">
                    <div className="bg-gradient-to-r from-industrial-blue/10 via-safety-green/10 to-warning-red/10 rounded-[var(--radius-card)] p-4 border border-industrial-blue/20 shadow-md">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-card/80 rounded-[var(--radius-input)] p-3 border border-border/30">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-lg bg-industrial-blue/10 flex items-center justify-center">
                              <Package className="w-3 h-3 text-industrial-blue" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">物品数量</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-industrial-blue">{scannedItems.length}</span>
                            <span className="text-sm font-medium text-muted-foreground">项</span>
                          </div>
                        </div>
                        <div className="bg-card/80 rounded-[var(--radius-input)] p-3 border border-border/30">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-lg bg-safety-green/10 flex items-center justify-center">
                              <Weight className="w-3 h-3 text-safety-green" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">总重量</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-safety-green">{getTotalWeight()}</span>
                            <span className="text-sm font-medium text-muted-foreground">KG</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card/60 rounded-[var(--radius-input)] border border-border/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>已选择 {scannedItems.length} 项</span>
                          {scannedItems.length > 0 && (
                            <>
                              <span>•</span>
                              <span>总重量 {getTotalWeight()} KG</span>
                            </>
                          )}
                        </div>
                        <Button
                          onClick={handleBatchOutbound}
                          disabled={scannedItems.length === 0}
                          className="h-10 px-6 bg-safety-green hover:bg-safety-green/90 text-white shadow-sm rounded-[var(--radius-button)] disabled:opacity-50"
                        >
                          <TruckIcon className="w-4 h-4 mr-2" />
                          合并出库
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        ) : (
          // 转移记录界面
          <div className="h-full p-6">
            <div className="h-full bg-secondary/40 rounded-[var(--radius-card)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-foreground">转移记录</h3>
                <Button className="bg-industrial-blue hover:bg-industrial-blue-dark text-white rounded-[var(--radius-button)]">
                  <Plus className="w-4 h-4 mr-2" />
                  新建转移单
                </Button>
              </div>
              
              <div className="space-y-3 overflow-auto">
                {transferRecords.map((record) => (
                  <div key={record.id} className="bg-card rounded-[var(--radius-card)] p-4 border border-border/30 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{record.transferNo}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="block">创建时间</span>
                            <span className="font-medium text-foreground">{record.createTime}</span>
                          </div>
                          <div>
                            <span className="block">物品数量</span>
                            <span className="font-medium text-foreground">{record.itemCount} 项</span>
                          </div>
                          <div>
                            <span className="block">总重量</span>
                            <span className="font-medium text-foreground">{record.totalWeight} KG</span>
                          </div>
                          <div>
                            <span className="block">接收单位</span>
                            <span className="font-medium text-foreground">{record.receiver}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>运输公司：{record.transportCompany}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="ml-4 rounded-[var(--radius-button)]">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 确认出库对话框 */}
      {showConfirmDialog && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-[var(--radius-card)] p-6 max-w-md w-full mx-4 shadow-xl border border-border">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-warning-red/10 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-warning-red" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">确认转移出库</h3>
              <p className="text-sm text-muted-foreground">请确认以下信息无误后继续操作</p>
            </div>
            
            <div className="space-y-2 mb-4 bg-muted/20 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">物品数量：</span>
                <span className="font-medium">{scannedItems.length} 项</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">总重量：</span>
                <span className="font-medium">{getTotalWeight()} KG</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">操作时间：</span>
                <span className="font-medium">{new Date().toLocaleString('zh-CN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">操作人员：</span>
                <span className="font-medium">张操作员</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="outline"
                className="flex-1 rounded-[var(--radius-button)]"
              >
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
              <Button
                onClick={confirmOutbound}
                className="flex-1 bg-safety-green hover:bg-safety-green/90 text-white rounded-[var(--radius-button)]"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                确认出库
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
