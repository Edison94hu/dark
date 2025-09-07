import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Search, ArrowUpDown, Filter, Trash2, Printer, Edit3, MoreHorizontal, ChevronDown, Eye, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Types for print records
export interface PrintRecord {
  id: string;
  uniqueId: string;
  wasteCategory: string;
  wasteCode: string;
  weight: number;
  printTime: string;
  printDate: string;
  hazardCode: string;
  uploadStatus: 'uploaded' | 'not_uploaded';
  labelSize: string;
  inventoryStatus: 'in' | 'out';
}

type SortField = 'printTime' | 'wasteCategory' | 'weight' | 'uniqueId';
type SortOrder = 'asc' | 'desc';

interface HistoryRecordsPageProps {
  onBack?: () => void;
}

export function HistoryRecordsPage({ onBack }: HistoryRecordsPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  // Mock data for print records - Extended to show 15 records
  const [allRecords] = useState<PrintRecord[]>([
    {
      id: '1',
      uniqueId: 'DW9004149001',
      wasteCategory: '废矿物油与含矿物油废物',
      wasteCode: '900-041-49',
      weight: 25.5,
      printTime: '14:32:15',
      printDate: '2024-01-15',
      hazardCode: 'HW08',
      uploadStatus: 'uploaded',
      labelSize: '150*150',
      inventoryStatus: 'out'
    },
    {
      id: '2',
      uniqueId: 'DW9003034002',
      wasteCategory: '废酸',
      wasteCode: '900-300-34',
      weight: 12.3,
      printTime: '13:45:22',
      printDate: '2024-01-15',
      hazardCode: 'HW34',
      uploadStatus: 'uploaded',
      labelSize: '100*100',
      inventoryStatus: 'out'
    },
    {
      id: '3',
      uniqueId: 'DW9003523003',
      wasteCategory: '废碱',
      wasteCode: '900-352-35',
      weight: 8.7,
      printTime: '12:18:45',
      printDate: '2024-01-15',
      hazardCode: 'HW35',
      uploadStatus: 'not_uploaded',
      labelSize: '150*150',
      inventoryStatus: 'in'
    },
    {
      id: '4',
      uniqueId: 'DW9004020004',
      wasteCategory: '废有机溶剂与含有机溶剂废物',
      wasteCode: '900-402-06',
      weight: 45.2,
      printTime: '11:25:10',
      printDate: '2024-01-15',
      hazardCode: 'HW06',
      uploadStatus: 'uploaded',
      labelSize: '200*200',
      inventoryStatus: 'out'
    },
    {
      id: '5',
      uniqueId: 'DW3970042005',
      wasteCategory: '含铜废物',
      wasteCode: '397-004-22',
      weight: 15.8,
      printTime: '10:15:33',
      printDate: '2024-01-15',
      hazardCode: 'HW22',
      uploadStatus: 'not_uploaded',
      labelSize: '150*150',
      inventoryStatus: 'in'
    },
    {
      id: '6',
      uniqueId: 'DW9002290006',
      wasteCategory: '含汞废物',
      wasteCode: '900-023-29',
      weight: 2.1,
      printTime: '09:42:18',
      printDate: '2024-01-15',
      hazardCode: 'HW29',
      uploadStatus: 'uploaded',
      labelSize: '100*100',
      inventoryStatus: 'out'
    },
    {
      id: '7',
      uniqueId: 'DW9002990007',
      wasteCategory: '废漆、染料、颜料废物',
      wasteCode: '900-299-12',
      weight: 33.4,
      printTime: '16:22:45',
      printDate: '2024-01-14',
      hazardCode: 'HW12',
      uploadStatus: 'not_uploaded',
      labelSize: '150*150',
      inventoryStatus: 'in'
    },
    {
      id: '8',
      uniqueId: 'DW2611515008',
      wasteCategory: '废催化剂',
      wasteCode: '261-151-50',
      weight: 18.9,
      printTime: '15:38:12',
      printDate: '2024-01-14',
      hazardCode: 'HW50',
      uploadStatus: 'not_uploaded',
      labelSize: '150*150',
      inventoryStatus: 'in'
    },
    {
      id: '9',
      uniqueId: 'DW3970055009',
      wasteCategory: '含锌废物',
      wasteCode: '397-005-22',
      weight: 22.7,
      printTime: '14:15:30',
      printDate: '2024-01-14',
      hazardCode: 'HW22',
      uploadStatus: 'uploaded',
      labelSize: '150*150',
      inventoryStatus: 'out'
    },
    {
      id: '10',
      uniqueId: 'DW3970022010',
      wasteCategory: '含铬废物',
      wasteCode: '397-002-22',
      weight: 9.4,
      printTime: '13:28:41',
      printDate: '2024-01-14',
      hazardCode: 'HW22',
      uploadStatus: 'not_uploaded',
      labelSize: '100*100',
      inventoryStatus: 'in'
    },
    {
      id: '11',
      uniqueId: 'DW9000192011',
      wasteCategory: '废胶片及废像纸',
      wasteCode: '900-019-16',
      weight: 5.2,
      printTime: '12:47:18',
      printDate: '2024-01-14',
      hazardCode: 'HW16',
      uploadStatus: 'uploaded',
      labelSize: '100*100',
      inventoryStatus: 'out'
    },
    {
      id: '12',
      uniqueId: 'DW9000022012',
      wasteCategory: '废弃的药品',
      wasteCode: '900-002-02',
      weight: 1.8,
      printTime: '11:34:52',
      printDate: '2024-01-14',
      hazardCode: 'HW02',
      uploadStatus: 'not_uploaded',
      labelSize: '100*100',
      inventoryStatus: 'in'
    },
    {
      id: '13',
      uniqueId: 'DW3970012013',
      wasteCategory: '含铅废物',
      wasteCode: '397-001-22',
      weight: 14.6,
      printTime: '10:52:07',
      printDate: '2024-01-13',
      hazardCode: 'HW22',
      uploadStatus: 'uploaded',
      labelSize: '150*150',
      inventoryStatus: 'out'
    },
    {
      id: '14',
      uniqueId: 'DW9004549014',
      wasteCategory: '电路板废料',
      wasteCode: '900-045-49',
      weight: 6.9,
      printTime: '09:18:33',
      printDate: '2024-01-13',
      hazardCode: 'HW49',
      uploadStatus: 'not_uploaded',
      labelSize: '100*100',
      inventoryStatus: 'in'
    },
    {
      id: '15',
      uniqueId: 'DW3970052015',
      wasteCategory: '含镍废物',
      wasteCode: '397-005-22',
      weight: 11.3,
      printTime: '08:45:12',
      printDate: '2024-01-13',
      hazardCode: 'HW22',
      uploadStatus: 'uploaded',
      labelSize: '150*150',
      inventoryStatus: 'out'
    }
  ]);

  // State management
  const [filteredRecords, setFilteredRecords] = useState<PrintRecord[]>(allRecords);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [selectedRecord, setSelectedRecord] = useState<PrintRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('printTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [dateFilter, setDateFilter] = useState('all');
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Filter and sort records
  useEffect(() => {
    let filtered = [...allRecords];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(record => 
        record.wasteCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.wasteCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.hazardCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(record => new Date(record.printDate) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(record => new Date(record.printDate) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(record => new Date(record.printDate) >= filterDate);
          break;
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'printTime':
          comparison = a.printTime.localeCompare(b.printTime);
          break;
        case 'wasteCategory':
          comparison = a.wasteCategory.localeCompare(b.wasteCategory);
          break;
        case 'weight':
          comparison = a.weight - b.weight;
          break;
        case 'uniqueId':
          comparison = a.uniqueId.localeCompare(b.uniqueId);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredRecords(filtered);
  }, [allRecords, searchQuery, dateFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setShowSortDropdown(false);
  };

  const handleRecordSelect = (recordId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedRecords);
    if (isSelected) {
      newSelected.add(recordId);
    } else {
      newSelected.delete(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRecords(new Set(filteredRecords.map(r => r.id)));
    } else {
      setSelectedRecords(new Set());
    }
  };

  const handleRecordClick = (record: PrintRecord) => {
    setSelectedRecord(record);
    setShowSidePanel(true);
    navigate(`/statistics/history/record/${record.id}${location.search || ''}`);
  };

  const getUploadStatusColor = (uploadStatus: string) => {
    switch (uploadStatus) {
      case 'uploaded': return 'bg-safety-green/20 text-safety-green border-safety-green/30';
      case 'not_uploaded': return 'bg-orange-400/20 text-orange-400 border-orange-400/30';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
    }
  };

  const getHazardCodeColor = (code: string) => {
    const colorMap: Record<string, string> = {
      'HW08': 'bg-industrial-blue/20 text-industrial-blue border-industrial-blue/30',
      'HW34': 'bg-warning-red/20 text-warning-red border-warning-red/30',
      'HW35': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'HW06': 'bg-safety-green/20 text-safety-green border-safety-green/30',
      'HW22': 'bg-orange-400/20 text-orange-400 border-orange-400/30',
      'HW29': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'HW12': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'HW50': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'HW16': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'HW02': 'bg-red-500/20 text-red-400 border-red-500/30',
      'HW49': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
    };
    return colorMap[code] || 'bg-gray-400/20 text-gray-400 border-gray-400/30';
  };

  // Check if record can be edited (only not uploaded records)
  const canEditRecord = (record: PrintRecord) => {
    return record.uploadStatus === 'not_uploaded';
  };

  // Get editable records count for batch operations
  const editableRecordsCount = filteredRecords.filter(r => selectedRecords.has(r.id) && canEditRecord(r)).length;

  // Sync filters/search/sort and side panel with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const date = params.get('date') as 'all' | 'today' | 'week' | 'month' | null;
    const sf = params.get('sortField') as SortField | null;
    const so = params.get('sortOrder') as SortOrder | null;
    if (q !== searchQuery) setSearchQuery(q);
    if (date && date !== dateFilter) setDateFilter(date);
    if (sf && sf !== sortField) setSortField(sf);
    if (so && so !== sortOrder) setSortOrder(so);

    const parts = location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'statistics' && parts[1] === 'history' && parts[2] === 'record') {
      const id = parts[3];
      if (id) {
        const rec = allRecords.find(r => r.id === id) || filteredRecords.find(r => r.id === id) || null;
        if (rec) {
          if (!selectedRecord || selectedRecord.id !== id) setSelectedRecord(rec);
          if (!showSidePanel) setShowSidePanel(true);
        }
      }
    } else {
      if (showSidePanel) setShowSidePanel(false);
      if (selectedRecord) setSelectedRecord(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!location.pathname.startsWith('/statistics/history')) return;
    const params = new URLSearchParams(location.search);
    if (searchQuery) params.set('q', searchQuery); else params.delete('q');
    params.set('date', dateFilter);
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    const next = `${location.pathname}?${params.toString()}`;
    const current = `${location.pathname}${location.search}`;
    if (next !== current) navigate(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, dateFilter, sortField, sortOrder]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Top Filter Bar */}
      <div className="flex-shrink-0 bg-background border-b border-border p-6">
        <div className="flex items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索记录..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground 
                       focus:ring-2 focus:ring-industrial-blue focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-foreground transition-all duration-200 ${
                showDateDropdown 
                  ? 'bg-industrial-blue text-white border-industrial-blue shadow-lg' 
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {dateFilter === 'all' ? '全部日期' : 
                 dateFilter === 'today' ? '今天' :
                 dateFilter === 'week' ? '本周' : '本月'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDateDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-background border border-border 
                            rounded-lg shadow-xl z-50 min-w-[120px]">
                {[
                  { value: 'all', label: '全部日期' },
                  { value: 'today', label: '今天' },
                  { value: 'week', label: '本周' },
                  { value: 'month', label: '本月' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateFilter(option.value);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors
                               first:rounded-t-lg last:rounded-b-lg ${
                      dateFilter === option.value ? 'bg-industrial-blue text-white' : 'text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-foreground transition-all duration-200 ${
                showSortDropdown 
                  ? 'bg-industrial-blue text-white border-industrial-blue shadow-lg' 
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm">排序</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-background border border-border 
                            rounded-lg shadow-xl z-50 min-w-[140px]">
                {[
                  { field: 'printTime' as SortField, label: '打印时间' },
                  { field: 'wasteCategory' as SortField, label: '废物类型' },
                  { field: 'weight' as SortField, label: '重量' },
                  { field: 'uniqueId' as SortField, label: '记录ID' }
                ].map((option) => (
                  <button
                    key={option.field}
                    onClick={() => handleSort(option.field)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors
                               first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                      sortField === option.field ? 'bg-industrial-blue text-white' : 'text-foreground'
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortField === option.field && (
                      <span className="text-xs opacity-70">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Record Count */}
          <div className="text-sm text-muted-foreground">
            显示 {filteredRecords.length} 条��录
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Records Table */}
        <div className={`flex flex-col overflow-hidden transition-all duration-300 w-full`}>
          {/* Table Header */}
          <div className="flex-shrink-0 bg-background/70 backdrop-blur-md border-b border-border/30 px-6 py-3">
            <div className="max-w-[960px] mx-auto">
              <div
                className="grid grid-cols-6 gap-3 text-lg font-bold text-muted-foreground"
                style={{ gridTemplateColumns: '2.2fr 3fr 1fr 1.6fr 1fr 1.4fr' }}
              >
                <div>危废名称</div>
                <div>记录编号</div>
                <div className="text-right pr-2">重量 (KG)</div>
                <div>打印时间</div>
                <div>库存状态</div>
                <div>上传状态</div>
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className={`flex-1 overflow-y-auto ${showSidePanel ? 'pointer-events-none' : ''}`}>
            {filteredRecords.map((record) => {
              return (
              <div
                key={record.id}
                onClick={() => handleRecordClick(record)}
                className={`border-b border-border/20 px-6 py-4 hover:bg-background/60 backdrop-blur-sm
                            cursor-pointer transition-all duration-200 ${
                  selectedRecord?.id === record.id ? 'bg-industrial-blue/15 backdrop-blur-md' : 'bg-background/30'
                }`}
              >
                <div className="max-w-[960px] mx-auto">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex-1 grid grid-cols-6 gap-3 items-center"
                      style={{ gridTemplateColumns: '2.2fr 3fr 1fr 1.6fr 1fr 1.4fr' }}
                    >
                    {/* Waste Category */}
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full ${
                        record.wasteCategory.includes('矿物油') ? 'bg-industrial-blue' :
                        record.wasteCategory.includes('酸') ? 'bg-warning-red' :
                        record.wasteCategory.includes('碱') ? 'bg-purple-500' :
                        record.wasteCategory.includes('溶剂') ? 'bg-safety-green' :
                        record.wasteCategory.includes('铜') ? 'bg-orange-400' :
                        record.wasteCategory.includes('汞') ? 'bg-yellow-500' :
                        record.wasteCategory.includes('漆') || record.wasteCategory.includes('染料') ? 'bg-pink-500' :
                        record.wasteCategory.includes('催化剂') ? 'bg-cyan-500' :
                        record.wasteCategory.includes('锌') ? 'bg-orange-300' :
                        record.wasteCategory.includes('铬') ? 'bg-orange-600' :
                        record.wasteCategory.includes('胶片') || record.wasteCategory.includes('像纸') ? 'bg-emerald-500' :
                        record.wasteCategory.includes('药品') ? 'bg-red-500' :
                        record.wasteCategory.includes('铅') ? 'bg-orange-700' :
                        record.wasteCategory.includes('电路板') ? 'bg-indigo-500' :
                        record.wasteCategory.includes('镍') ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`} />
                      <span className="text-lg text-foreground truncate font-semibold" title={record.wasteCategory}>
                        {record.wasteCategory}
                      </span>
                    </div>

                    {/* Unique ID (记录编号) with last 3 highlighted */}
                    <div className="max-w-full" title={record.uniqueId}>
                      {(() => {
                        const id = record.uniqueId || "";
                        const head = id.slice(0, Math.max(0, id.length - 3));
                        const tail = id.slice(-3);
                        return (
                          <div className="flex items-center gap-1 max-w-full">
                            <span className="text-lg font-mono text-muted-foreground font-medium truncate leading-none flex-1 min-w-0">
                              {head}
                            </span>
                            <span className="text-lg font-mono font-bold text-industrial-blue bg-industrial-blue/10 rounded px-1.5 py-0.5 leading-none flex-none">
                              {tail}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Weight */}
                    <div className="text-lg text-foreground font-bold text-right pr-2">
                      {record.weight.toFixed(1)}
                    </div>

                    {/* Print Time */}
                    <div className="text-lg text-muted-foreground">
                      <div className="font-semibold">{record.printTime}</div>
                      <div className="text-base text-muted-foreground/70">{record.printDate}</div>
                    </div>

                    {/* Inventory Status */}
                    <div className="flex items-center">
                      <span className={`px-3 py-1.5 rounded-md text-base font-bold border ${
                        record.inventoryStatus === 'in'
                          ? 'bg-industrial-blue/20 text-industrial-blue border-industrial-blue/30'
                          : 'bg-warning-red/20 text-warning-red border-warning-red/30'
                      }`}>
                        {record.inventoryStatus === 'in' ? '在库' : '出库'}
                      </span>
                    </div>

                    {/* Upload Status */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-md text-base font-bold border flex items-center gap-1 ${
                        getUploadStatusColor(record.uploadStatus)
                      }`}>
                        {record.uploadStatus === 'uploaded' ? (
                          <>
                            <Upload className="w-5 h-5" />
                            已上传
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 border border-current rounded-sm opacity-60" />
                            未上传
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Overlay blur over list */}
        {showSidePanel && (
          <div
            className="absolute inset-0 z-10 bg-background/20 backdrop-blur-sm"
            onClick={() => {
              setShowSidePanel(false);
              navigate(`/statistics/history${location.search || ''}`);
            }}
          />
        )}

        {/* Side Action Panel (overlay) */}
        {showSidePanel && selectedRecord && (
          <div className="absolute top-0 right-0 h-full z-20 w-[35%] min-w-[360px] max-w-[480px] bg-card border-l border-border flex flex-col shadow-2xl">
            {/* Panel Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-border/30">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  {canEditRecord(selectedRecord) ? '编辑记录' : '查看记录'}
                </h3>
                <button
                  onClick={() => {
                    setShowSidePanel(false);
                    navigate(`/statistics/history${location.search || ''}`);
                  }}
                  className="p-2 hover:bg-background/60 rounded-lg transition-colors"
                >
                  <span className="text-muted-foreground text-lg">×</span>
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Record Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">记录编号</label>
                  <div className="bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/20">
                    {(() => {
                      const id = selectedRecord.uniqueId || "";
                      const head = id.slice(0, Math.max(0, id.length - 3));
                      const tail = id.slice(-3);
                      return (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-foreground break-all">
                            {head}
                          </span>
                          <span className="font-mono font-bold text-industrial-blue bg-industrial-blue/10 rounded px-1.5 py-0.5">
                            {tail}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">废物类型</label>
                  <div className="text-foreground bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/20">
                    {selectedRecord.wasteCategory}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">重量 (KG)</label>
                  {canEditRecord(selectedRecord) ? (
                    <Input
                      type="number"
                      step="0.1"
                      defaultValue={selectedRecord.weight}
                      className="bg-background/60 backdrop-blur-sm border-border/30 text-foreground"
                    />
                  ) : (
                    <div className="text-foreground bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/20">
                      {selectedRecord.weight.toFixed(1)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">危险代码</label>
                  <div className={`inline-block px-3 py-1 rounded-md text-sm font-semibold border ${
                    getHazardCodeColor(selectedRecord.hazardCode)
                  }`}>
                    {selectedRecord.hazardCode}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">打印时间</label>
                  <div className="text-foreground bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/20">
                    {selectedRecord.printDate} {selectedRecord.printTime}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">标签尺寸</label>
                  <div className="text-foreground bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/20">
                    {selectedRecord.labelSize} mm
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">上传状态</label>
                  <div className={`inline-block px-3 py-1 rounded-md text-sm font-semibold border flex items-center gap-2 ${
                    getUploadStatusColor(selectedRecord.uploadStatus)
                  }`}>
                    {selectedRecord.uploadStatus === 'uploaded' ? (
                      <>
                        <Upload className="w-4 h-4" />
                        已上传到服务器
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 border border-current rounded-sm opacity-60" />
                        等待上传
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {canEditRecord(selectedRecord) ? (
                  // Editable record actions
                  <>
                    <Button className="w-full bg-industrial-blue hover:bg-industrial-blue-light text-white">
                      <Edit3 className="w-4 h-4 mr-2" />
                      保存修改
                    </Button>

                    <Button className="w-full bg-safety-green hover:bg-green-500 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      上传数据
                    </Button>

                    <Button className="w-full bg-gray-600 hover:bg-gray-500 text-white">
                      <Printer className="w-4 h-4 mr-2" />
                      重新打印
                    </Button>

                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除记录
                    </Button>
                  </>
                ) : (
                  // View-only record actions
                  <>
                    <Button className="w-full bg-gray-600 hover:bg-gray-500 text-white">
                      <Eye className="w-4 h-4 mr-2" />
                      详细信息
                    </Button>

                    <Button className="w-full bg-safety-green hover:bg-green-500 text-white">
                      <Printer className="w-4 h-4 mr-2" />
                      重新打印
                    </Button>

                    <div className="bg-background/60 backdrop-blur-sm border border-border/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Upload className="w-4 h-4" />
                        <span>此记录已上传，无法编辑</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Batch Actions Toolbar */}
      {selectedRecords.size > 0 && (
        <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm border-t border-border/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-foreground">
              已选择 {selectedRecords.size} 条记录
              {editableRecordsCount < selectedRecords.size && (
                <span className="text-orange-400 ml-2">
                  ({editableRecordsCount} 条可编辑)
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              {editableRecordsCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-safety-green text-safety-green hover:bg-safety-green hover:text-white bg-background/60 backdrop-blur-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  批量上传 ({editableRecordsCount})
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                className="border-border text-muted-foreground hover:bg-background/60 hover:text-foreground bg-background/60 backdrop-blur-sm"
              >
                <Printer className="w-4 h-4 mr-2" />
                批量重打印
              </Button>

              {editableRecordsCount > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="bg-warning-red/80 backdrop-blur-sm hover:bg-warning-red"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  批量删除 ({editableRecordsCount})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
