import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./components/ThemeProvider";
// Removed ThemeProvider - using light mode only
import { TopBar, DeviceStatus } from "./components/TopBar";
import { WasteTypeList, SortMode } from "./components/WasteTypeList";
import { WasteType } from "./components/WasteTypeCard";
import { WeightOperationPanel, WeightUnit, LabelSize } from "./components/WeightOperationPanel";

import { BottomNavigation, NavigationTab } from "./components/BottomNavigation";
import { HistoryAnalyticsTabPage } from "./components/HistoryAnalyticsTabPage";
import { TransferOutboundPage } from "./components/TransferOutboundPage";
import { PersonalCenterPage } from "./components/PersonalCenterPage";

type EntryMode = "normal" | "backfill";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  // Device status
  const [printerStatus, setPrinterStatus] = useState<DeviceStatus>("connected");
  const [scaleStatus, setScaleStatus] = useState<DeviceStatus>("disconnected");

  // Company and operator info
  const [companyName] = useState<string>("杭州示例化工有限公司");
  const [operatorName] = useState<string>("张操作员");

  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>("collection");

  // Sync activeTab with URL path
  useEffect(() => {
    const path = location.pathname.split("/")[1] || "";
    const next: NavigationTab =
      path === "statistics" ? "statistics" :
      path === "devices" ? "devices" :
      path === "profile" ? "profile" :
      "collection";
    setActiveTab((prev) => (prev === next ? prev : next));
  }, [location.pathname]);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    const to =
      tab === "collection" ? "/collection" :
      tab === "statistics" ? "/statistics" :
      tab === "devices" ? "/devices" :
      "/profile";
    if (location.pathname !== to) navigate(`${to}${location.search || ''}`);
  };

  // Sync theme from URL -> app theme
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('theme');
    if (t === 'light' && resolvedTheme !== 'light') setTheme('light');
    if (t === 'dark' && resolvedTheme !== 'dark') setTheme('dark');
  }, [location.search]);

  // Reflect app theme -> URL (keep existing params)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('theme') !== resolvedTheme) {
      params.set('theme', resolvedTheme);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme, location.pathname]);

  // Global: if URL contains edit=personal|company, deep-link to profile/basic-info
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const edit = params.get('edit');
    const onProfileBasic = location.pathname.startsWith('/profile/basic-info');
    if ((edit === 'personal' || edit === 'company') && !onProfileBasic) {
      // Keep existing query params; just change the pathname to basic-info
      const query = params.toString();
      navigate(`/profile/basic-info${query ? `?${query}` : ''}`, { replace: true });
    }
    const onDeviceMgmt = location.pathname.startsWith('/profile/device-management');
    if (edit === 'scale' && !onDeviceMgmt) {
      const query = params.toString();
      navigate(`/profile/device-management${query ? `?${query}` : ''}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // Entry mode for data collection
  const [entryMode, setEntryMode] = useState<EntryMode>("normal");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Waste type data - Extended with more types
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([
    {
      id: "1",
      name: "废矿物油与含矿物油废物",
      code: "900-041-49",
      frequency: 45
    },
    {
      id: "2",
      name: "废酸",
      code: "900-300-34",
      frequency: 32
    },
    {
      id: "3",
      name: "废碱",
      code: "900-352-35",
      frequency: 28
    },
    {
      id: "4",
      name: "废有机溶剂与含有机溶剂废物",
      code: "900-402-06",
      frequency: 21
    },
    {
      id: "5",
      name: "含铜废物",
      code: "397-004-22",
      frequency: 18
    },
    {
      id: "6",
      name: "含锌废物",
      code: "397-005-22",
      frequency: 15
    },
    {
      id: "7",
      name: "含铬废物",
      code: "397-002-22",
      frequency: 12
    },
    {
      id: "8",
      name: "废催化剂",
      code: "261-151-50",
      frequency: 8
    },
    {
      id: "9",
      name: "含汞废物",
      code: "900-023-29",
      frequency: 6
    },
    {
      id: "10",
      name: "废漆、染料、颜料废物",
      code: "900-299-12",
      frequency: 5
    },
    {
      id: "11",
      name: "含镍废物",
      code: "397-005-22",
      frequency: 4
    },
    {
      id: "12",
      name: "废胶片及废像纸",
      code: "900-019-16",
      frequency: 3
    },
    {
      id: "13",
      name: "废弃的药品",
      code: "900-002-02",
      frequency: 2
    },
    {
      id: "14",
      name: "含铅废物",
      code: "397-001-22",
      frequency: 2
    },
    {
      id: "15",
      name: "电路板废料",
      code: "900-045-49",
      frequency: 1
    }
  ]);

  // Selection and sorting
  const [selectedWasteId, setSelectedWasteId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("frequency");

  // Weight operations
  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("KG");
  const [labelSize, setLabelSize] = useState<LabelSize>("150*150");
  const [isWeightLocked, setIsWeightLocked] = useState<boolean>(false);

  // Get selected waste type name and data
  const selectedWasteData = wasteTypes.find(w => w.id === selectedWasteId) || null;
  const selectedWasteType = selectedWasteData?.name || null;

  // Simulate device status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change device status for demo
      if (Math.random() > 0.8) {
        setPrinterStatus(prev => prev === "connected" ? "disconnected" : "connected");
      }
      if (Math.random() > 0.8) {
        setScaleStatus(prev => prev === "connected" ? "disconnected" : "connected");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate automatic weight from scale when connected
  useEffect(() => {
    if (scaleStatus === "connected" && !isWeightLocked) {
      const interval = setInterval(() => {
        // Simulate weight fluctuation
        const baseWeight = parseFloat(weight) || 0;
        const fluctuation = (Math.random() - 0.5) * 0.02; // ±0.01 kg variation
        const newWeight = Math.max(0, baseWeight + fluctuation);
        
        // Convert weight based on current unit for display
        if (weightUnit === "KG") {
          setWeight(newWeight.toFixed(2));
        } else {
          // For T display, we store the actual KG value but show converted
          setWeight((newWeight * 1000).toFixed(0)); // Store as KG internally
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [scaleStatus, isWeightLocked, weight, weightUnit]);

  const handleWasteSelect = (id: string) => {
    setSelectedWasteId(id);
    // Increment frequency when selected
    setWasteTypes(prev => prev.map(waste => 
      waste.id === id 
        ? { ...waste, frequency: waste.frequency + 1 }
        : waste
    ));
  };

  const handleReorder = (newOrder: WasteType[]) => {
    setWasteTypes(newOrder);
  };

  const handleWeightChange = (newWeight: string) => {
    // Store weight in KG internally regardless of display unit
    if (weightUnit === "T") {
      // Convert from T to KG for internal storage
      const kgWeight = parseFloat(newWeight) * 1000;
      setWeight(kgWeight.toString());
    } else {
      setWeight(newWeight);
    }
  };

  const handleWeightUnitChange = (unit: WeightUnit) => {
    const currentWeightNum = parseFloat(weight) || 0;
    
    if (weightUnit === "KG" && unit === "T") {
      // Converting from KG to T display
      setWeight(currentWeightNum.toString()); // Keep KG value internally
    } else if (weightUnit === "T" && unit === "KG") {
      // Converting from T to KG display  
      setWeight(currentWeightNum.toString()); // Keep KG value internally
    }
    
    setWeightUnit(unit);
  };

  const handleWeightLockToggle = () => {
    setIsWeightLocked(prev => !prev);
  };

  const handleTare = () => {
    // 将读数置零（按内部KG存储）
    setWeight("0");
    setLastTareAt(new Date().toISOString());
    setJustTared(true);
    window.setTimeout(() => setJustTared(false), 1000);
  };

  const handlePrint = () => {
    if (selectedWasteType && weight) {
      const displayWeight = weightUnit === "T" ? 
        `${(parseFloat(weight) / 1000).toFixed(3)} T` : 
        `${weight} KG`;
      
      const dateInfo = entryMode === "backfill" ? `\n录入日期: ${selectedDate}` : "";
      
      console.log(`Printing label for: ${selectedWasteType}, Weight: ${displayWeight}, Size: ${labelSize}${dateInfo}`);
      
      // Reset after print
      setWeight("");
      setIsWeightLocked(false);
      setSelectedWasteId(null);
      
      // Show success feedback (in real app, this would be a toast)
      alert(`标签打印成功！\n废物类型: ${selectedWasteType}\n重量: ${displayWeight}\n尺寸: ${labelSize} mm${dateInfo}`);
    }
  };

  // API 状态（示例：真实项目可由心跳/请求结果驱动）
  const [apiStatus, setApiStatus] = useState<'ok' | 'error' | 'unknown'>('ok');
  const [lastTareAt, setLastTareAt] = useState<string | null>(null);
  const [justTared, setJustTared] = useState(false);

  // ---------------- URL <-> State sync for Collection tab ----------------
  // Read from URL when on /collection
  useEffect(() => {
    if (!location.pathname.startsWith('/collection')) return;
    const params = new URLSearchParams(location.search);
    const wid = params.get('wid');
    const sort = params.get('sort') as SortMode | null;
    const unit = params.get('unit') as WeightUnit | null;
    const label = params.get('label') as LabelSize | null;
    const w = params.get('weight');
    const lock = params.get('lock') === '1';
    const mode = params.get('mode') as EntryMode | null;
    const date = params.get('date');
    const tareTs = params.get('tareTs');
    const justTare = params.get('justTare') === '1';

    if ((wid || wid === '') && wid !== selectedWasteId) {
      setSelectedWasteId(wid && wid !== 'null' ? wid : null);
    }
    if (sort && (sort === 'frequency' || sort === 'custom') && sort !== sortMode) {
      setSortMode(sort);
    }
    if (unit && (unit === 'KG' || unit === 'T') && unit !== weightUnit) {
      setWeightUnit(unit);
    }
    if (label && label !== labelSize) {
      setLabelSize(label);
    }
    if (w !== null && w !== undefined && w !== weight) {
      setWeight(w);
    }
    if (lock !== isWeightLocked) {
      setIsWeightLocked(lock);
    }
    if (mode && (mode === 'normal' || mode === 'backfill') && mode !== entryMode) {
      setEntryMode(mode);
    }
    if (date && date !== selectedDate) {
      setSelectedDate(date);
    }
    if (tareTs && tareTs !== lastTareAt) {
      setLastTareAt(tareTs);
    }
    if (justTare !== justTared) {
      setJustTared(justTare);
      if (justTare) {
        window.setTimeout(() => setJustTared(false), 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // Reflect to URL when active tab is collection (force path to /collection)
  useEffect(() => {
    if (activeTab !== 'collection') return;
    // If URL carries any edit=*, avoid writing collection URL
    // so global deep-link handler can redirect without race.
    const existing = new URLSearchParams(location.search);
    if (existing.has('edit')) return;
    const params = new URLSearchParams(location.search);
    if (selectedWasteId) params.set('wid', selectedWasteId); else params.delete('wid');
    params.set('sort', sortMode);
    if (weight) params.set('weight', weight); else params.delete('weight');
    params.set('unit', weightUnit);
    params.set('label', labelSize);
    if (isWeightLocked) params.set('lock', '1'); else params.delete('lock');
    params.set('mode', entryMode);
    if (entryMode === 'backfill' && selectedDate) params.set('date', selectedDate); else params.delete('date');
    if (lastTareAt) params.set('tareTs', lastTareAt); else params.delete('tareTs');
    if (justTared) params.set('justTare', '1'); else params.delete('justTare');

    const next = `/collection?${params.toString()}`.replace(/\?$/, '');
    const current = `${location.pathname}${location.search}`;
    if (next !== current) {
      navigate(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedWasteId, sortMode, weight, weightUnit, labelSize, isWeightLocked, entryMode, selectedDate, lastTareAt, justTared]);

  // Render different content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case "collection":
        return (
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* 左列 - 危废种类列表 (35%) - 更多展示空间 */}
            <div className="w-[35%] flex flex-col overflow-hidden min-h-0 bg-card/30">
              {/* 危废种类列表 - 占据全部空间 */}
              <div className="flex-1 p-4 overflow-auto">
                <WasteTypeList
                  wasteTypes={wasteTypes}
                  selectedId={selectedWasteId}
                  sortMode={sortMode}
                  onSelect={handleWasteSelect}
                  onSortModeChange={setSortMode}
                  onReorder={handleReorder}
                />
              </div>
            </div>
            
            {/* 右列 - 重量操作区域 (65%) - 适应1024×768 */}
            <div className="w-[65%] flex flex-col border-l-2 border-border overflow-hidden min-h-0 bg-background">
              
              {/* 主要操作区域 - 全高度使用 */}
              <div className="flex-1 p-4 overflow-auto min-h-0">
                <WeightOperationPanel
                  weight={weight}
                  weightUnit={weightUnit}
                  labelSize={labelSize}
                  isWeightLocked={isWeightLocked}
                  selectedWasteType={selectedWasteType}
                  selectedWasteData={selectedWasteData}
                  printerStatus={printerStatus}
                  scaleStatus={scaleStatus}
                  onWeightChange={handleWeightChange}
                  onWeightUnitChange={handleWeightUnitChange}
                  onLabelSizeChange={setLabelSize}
                  onWeightLockToggle={handleWeightLockToggle}
                  onPrint={handlePrint}
                  onTare={handleTare}
                  lastTareAt={lastTareAt}
                  justTared={justTared}
                  entryMode={entryMode}
                  selectedDate={entryMode === "backfill" ? selectedDate : undefined}
                  onDateChange={setSelectedDate}
                  onEntryModeChange={setEntryMode}
                  apiStatus={apiStatus}
                />
              </div>
            </div>
          </div>
        );

      case "statistics":
        return (
          <div className="flex-1 overflow-auto">
            <HistoryAnalyticsTabPage />
          </div>
        );

      case "devices":
        return (
          <div className="flex-1 overflow-auto">
            <TransferOutboundPage />
          </div>
        );

      case "profile":
        return (
          <div className="flex-1 overflow-auto">
            <PersonalCenterPage />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      {/* 固定尺寸的应用容器 - 为HTML to Design插件优化 */}
      <div 
        className="bg-background border border-border shadow-lg overflow-hidden flex flex-col"
        style={{ 
          width: '1024px', 
          height: '768px',
          minWidth: '1024px',
          minHeight: '768px',
          maxWidth: '1024px',
          maxHeight: '768px'
        }}
      >
        {/* 顶部栏 - 固定在顶部 */}
        <div className="flex-shrink-0 z-50" style={{ height: '64px' }}>
          <TopBar />
        </div>

        {/* 主内容区域 - 填充剩余空间 */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ height: 'calc(768px - 64px - 72px)' }}>
          {renderMainContent()}
        </div>

        {/* 底部导航栏 - 固定在底部 */}
        <div className="flex-shrink-0 border-t border-border z-50" style={{ height: '72px' }}>
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
    </div>
  );
}
