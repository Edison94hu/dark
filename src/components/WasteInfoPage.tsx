import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  FileText,
  Database
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Checkbox } from "./ui/checkbox";

interface WasteRecord {
  id: string;
  name: string;
  category: string;
  code: string;
  state: "固态" | "液态" | "气态";
  wasteId: string;
  facilityCode: string;
  wasteCode: string;
  // 新增：属性（生产危废/此生危废）
  attribute: string;
  mainComponent: string;
  harmfulComponent: string;
  preventiveMeasures: string;
  dangerousCharacteristics: string[];
}

export function WasteInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Mock waste records data
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([
    {
      id: "1",
      name: "废矿物油",
      category: "HW08",
      code: "DW001",
      state: "液态",
      wasteId: "WID-001",
      facilityCode: "FC-001",
      wasteCode: "900-041-49",
      attribute: "生产危废",
      mainComponent: "矿物油类",
      harmfulComponent: "重金属、有机化合物",
      preventiveMeasures: "密闭储存，避免泄漏，远离火源",
      dangerousCharacteristics: ["易燃", "毒性", "腐蚀性"]
    },
    {
      id: "2",
      name: "废酸液",
      category: "HW34",
      code: "DW002",
      state: "液态",
      wasteId: "WID-002",
      facilityCode: "FC-002",
      wasteCode: "900-300-34",
      attribute: "生产危废",
      mainComponent: "硫酸、盐酸",
      harmfulComponent: "强酸性物质",
      preventiveMeasures: "防腐容器储存，避免与碱性物质接触",
      dangerousCharacteristics: ["腐蚀性"]
    },
    {
      id: "3",
      name: "含铜废料",
      category: "HW22",
      code: "DW003",
      state: "固态",
      wasteId: "WID-003",
      facilityCode: "FC-003",
      wasteCode: "397-004-22",
      attribute: "此生危废",
      mainComponent: "铜及其化合物",
      harmfulComponent: "重金属铜离子",
      preventiveMeasures: "防水防潮，分类储存",
      dangerousCharacteristics: ["毒性"]
    }
  ]);

  // Form state
  const [formData, setFormData] = useState<WasteRecord>({
    id: "",
    name: "",
    category: "",
    code: "",
    state: "固态",
    wasteId: "",
    facilityCode: "",
    wasteCode: "",
    attribute: "",
    mainComponent: "",
    harmfulComponent: "",
    preventiveMeasures: "",
    dangerousCharacteristics: []
  });



  const handleRecordSelect = (record: WasteRecord) => {
    setSelectedRecordId(record.id);
    setFormData(record);
    setIsEditing(true);
    // reflect in URL
    navigate(`/profile/waste-info/edit/${record.id}${location.search || ''}`);
  };

  const handleAddNew = () => {
    setSelectedRecordId(null);
    setFormData({
      id: `new-${Date.now()}`,
      name: "",
      category: "",
      code: "",
      state: "固态",
      wasteId: "",
      facilityCode: "",
      wasteCode: "",
      attribute: "",
      mainComponent: "",
      harmfulComponent: "",
      preventiveMeasures: "",
      dangerousCharacteristics: []
    });
    setIsEditing(true); // Set to true to show the form
    // URL for new entry
    navigate(`/profile/waste-info/new${location.search || ''}`);
  };

  const handleDeleteRecord = (id: string) => {
    setWasteRecords(prev => prev.filter(record => record.id !== id));
    if (selectedRecordId === id) {
      setSelectedRecordId(null);
      setIsEditing(false);
      setFormData({
        id: "",
        name: "",
        category: "",
        code: "",
        state: "固态",
        wasteId: "",
        facilityCode: "",
        wasteCode: "",
        attribute: "",
        mainComponent: "",
        harmfulComponent: "",
        preventiveMeasures: "",
        dangerousCharacteristics: []
      });
    }
    navigate(`/profile/waste-info${location.search || ''}`);
  };

  const handleSave = () => {
    // 基础校验：除“危废ID”和“设施编码”外，其余均必填
    const requiredFields: Array<[keyof WasteRecord, string]> = [
      ["name", "危废名称"],
      ["category", "危废类别"],
      ["wasteCode", "危废代码"],
      ["state", "危废形态"],
      ["attribute", "属性"],
      ["mainComponent", "主要成分"],
      ["harmfulComponent", "有害成分"],
      ["preventiveMeasures", "预防措施"],
    ];

    const missing = requiredFields.filter(([key]) => {
      const v = (formData as any)[key];
      return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
    });

    const dangerousOk = formData.dangerousCharacteristics && formData.dangerousCharacteristics.length > 0;
    if (missing.length > 0 || !dangerousOk) {
      const names = missing.map(([, label]) => label).join("、");
      const extra = dangerousOk ? "" : (names ? "、危险特性" : "危险特性");
      alert(`请完善必填项：${names}${extra}`);
      return;
    }

    if (isEditing && selectedRecordId) {
      // Update existing record
      setWasteRecords(prev => prev.map(record => 
        record.id === selectedRecordId ? formData : record
      ));
    } else {
      // Add new record
      setWasteRecords(prev => [...prev, formData]);
    }
    
    // Reset to placeholder state
    setSelectedRecordId(null);
    setIsEditing(false);
    setFormData({
      id: "",
      name: "",
      category: "",
      code: "",
      state: "固态",
      wasteId: "",
      facilityCode: "",
      wasteCode: "",
      attribute: "",
      mainComponent: "",
      harmfulComponent: "",
      preventiveMeasures: "",
      dangerousCharacteristics: []
    });
    // Back to list URL
    navigate(`/profile/waste-info${location.search || ''}`);
  };

  const handleCancel = () => {
    if (selectedRecordId) {
      const originalRecord = wasteRecords.find(r => r.id === selectedRecordId);
      if (originalRecord) {
        setFormData(originalRecord);
      }
    } else {
      // Clear form and exit editing mode
      setSelectedRecordId(null);
      setIsEditing(false);
      setFormData({
        id: "",
        name: "",
        category: "",
        code: "",
        state: "固态",
        wasteId: "",
        facilityCode: "",
        wasteCode: "",
        mainComponent: "",
        harmfulComponent: "",
        preventiveMeasures: "",
        dangerousCharacteristics: []
      });
    }
    navigate(`/profile/waste-info${location.search || ''}`);
  };

  const handleInputChange = (field: keyof WasteRecord, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle dangerous characteristics checkbox changes
  const handleDangerousCharacteristicsChange = (characteristic: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dangerousCharacteristics: checked 
        ? [...prev.dangerousCharacteristics, characteristic]
        : prev.dangerousCharacteristics.filter(c => c !== characteristic)
    }));
  };

  // Define dangerous characteristics options
  const dangerousCharacteristicsOptions = ["易燃", "腐蚀性", "毒性", "反应性"];

  // Sync internal editing state from URL
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    // expect: ["profile", "waste-info", ...]
    if (parts[0] !== 'profile' || parts[1] !== 'waste-info') {
      return; // not our section
    }
    const sub = parts[2];
    if (!sub) {
      // list/placeholder view
      if (isEditing || selectedRecordId) {
        setIsEditing(false);
        setSelectedRecordId(null);
      }
      return;
    }
    if (sub === 'new') {
      // new entry view
      if (!isEditing || selectedRecordId !== null) {
        setSelectedRecordId(null);
        setIsEditing(true);
        setFormData(prev => ({
          ...prev,
          id: prev.id && prev.id.startsWith('new-') ? prev.id : `new-${Date.now()}`,
          name: "",
          category: "",
          code: "",
          state: "固态",
          wasteId: "",
          facilityCode: "",
          wasteCode: "",
          attribute: "",
          mainComponent: "",
          harmfulComponent: "",
          preventiveMeasures: "",
          dangerousCharacteristics: []
        }));
      }
      return;
    }
    if (sub === 'edit') {
      const id = parts[3];
      if (id) {
        const rec = wasteRecords.find(r => r.id === id);
        if (rec) {
          setSelectedRecordId(id);
          setFormData(rec);
          setIsEditing(true);
          return;
        }
      }
      // fallback
      setSelectedRecordId(null);
      setIsEditing(false);
      navigate(`/profile/waste-info${location.search || ''}`, { replace: true });
    }
  }, [location.pathname]);

  return (
    <div className="h-full bg-background p-6 overflow-hidden">
      {/* Main Content - Dual Column Layout */}
      <div className="h-full flex gap-6">
        {/* Left Column - Waste Records List */}
        <div className="w-[45%] bg-card rounded-[var(--radius-card)] shadow-sm border border-[var(--color-border)] overflow-hidden h-full flex flex-col" style={{ borderRadius: '16px' }}>
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">危废信息记录列表</h3>
          </div>

          {/* Waste Records List */}
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {wasteRecords.map((record, index) => (
              <div key={record.id}>
                <div 
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:border-[var(--color-industrial-blue-light)] ${
                    selectedRecordId === record.id 
                      ? 'border-[var(--color-industrial-blue)] bg-[color:var(--color-industrial-blue)]/10' 
                      : 'border-border bg-card hover:bg-accent/40'
                  }`}
                  onClick={() => handleRecordSelect(record)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-foreground">{record.name}</h4>
                      <span className="px-2 py-1 bg-[var(--color-industrial-blue)] text-white text-xs rounded">{record.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecordSelect(record);
                        }}
                        className="p-1 text-muted-foreground hover:text-[var(--color-industrial-blue)] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-muted-foreground hover:text-[var(--color-warning-red)] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要删除危废记录 "{record.name}" 吗？此操作无法撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-border text-muted-foreground">取消</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteRecord(record.id)}
                              className="bg-[var(--color-warning-red)] hover:bg-red-600 text-white"
                            >
                              确认删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>编号: {record.code}</span>
                    <span>形态: {record.state}</span>
                  </div>
                </div>
                {index < wasteRecords.length - 1 && (
                  <div className="h-px bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Waste Information Form */}
        <div className="w-[55%] bg-card rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden" style={{ borderRadius: '16px' }}>
          {(selectedRecordId || isEditing) ? (
            // Show form when editing or record selected
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedRecordId ? '编辑危废信息' : '新增危废信息'}
                </h2>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                {/* 基础信息 */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">基础信息</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">危废 ID</label>
                      <Input
                        value={formData.wasteId}
                        onChange={(e) => handleInputChange('wasteId', e.target.value)}
                        className="border-border focus:border-[var(--color-industrial-blue)] bg-input"
                        placeholder="请输入危废ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">设施编码</label>
                      <Input
                        value={formData.facilityCode}
                        onChange={(e) => handleInputChange('facilityCode', e.target.value)}
                        className="border-border focus:border-[var(--color-industrial-blue)] bg-input"
                        placeholder="请输入设施编码"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">危废名称 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-border focus:border-[var(--color-industrial-blue)] bg-input"
                        placeholder="请输入危废名称"
                      />
                    </div>
                  </div>
                </div>

                {/* 分类信息 */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">分类信息</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">危废类别 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <Input
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="border-border focus:border-[var(--color-industrial-blue)] bg-input"
                        placeholder="例：HW08"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">危废代码 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <Input
                        value={formData.wasteCode}
                        onChange={(e) => handleInputChange('wasteCode', e.target.value)}
                        className="border-border focus:border-[var(--color-industrial-blue)] bg-input"
                        placeholder="例：900-041-49"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">属性 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <Select
                        value={formData.attribute}
                        onValueChange={(value) => handleInputChange('attribute', value)}
                      >
                        <SelectTrigger className="border-border focus:border-[var(--color-industrial-blue)] bg-input">
                          <SelectValue placeholder="请选择属性" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          <SelectItem value="生产危废">生产危废</SelectItem>
                          <SelectItem value="此生危废">此生危废</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">危废形态 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => handleInputChange('state', value)}
                      >
                        <SelectTrigger className="border-border focus:border-[var(--color-industrial-blue)] bg-input">
                          <SelectValue placeholder="请选择危废形态" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          <SelectItem value="固态">固态</SelectItem>
                          <SelectItem value="液态">液态</SelectItem>
                          <SelectItem value="气态">气态</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 成分信息 */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">成分信息</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">主要成分 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <Input
                        value={formData.mainComponent}
                        onChange={(e) => handleInputChange('mainComponent', e.target.value)}
                        className="border-border focus:border-[var(--color-industrial-blue)] bg-input"
                        placeholder="请输入主要成分"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">有害成分 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <Input
                        value={formData.harmfulComponent}
                        onChange={(e) => handleInputChange('harmfulComponent', e.target.value)}
                        className="border-border focus:border-[var(--color-industrial-blue)] bg-input"
                        placeholder="请输入有害成分"
                      />
                    </div>
                  </div>
                </div>

                {/* 安全信息 */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">安全信息</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">预防措施 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <Textarea
                        value={formData.preventiveMeasures}
                        onChange={(e) => handleInputChange('preventiveMeasures', e.target.value)}
                        className="border-border focus:border-[var(--color-industrial-blue)] bg-input resize-none"
                        rows={3}
                        placeholder="请输入预防措施"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-3">危险特性 <span className="ml-1 text-[var(--color-warning-red)]">*</span></label>
                      <div className="grid grid-cols-2 gap-3">
                        {dangerousCharacteristicsOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`dangerous-${option}`}
                              checked={formData.dangerousCharacteristics.includes(option)}
                              onCheckedChange={(checked) => 
                                handleDangerousCharacteristicsChange(option, checked as boolean)
                              }
                              className="border-border data-[state=checked]:bg-[var(--color-industrial-blue)] data-[state=checked]:border-[var(--color-industrial-blue)]"
                            />
                            <label 
                              htmlFor={`dangerous-${option}`}
                              className="text-sm text-foreground cursor-pointer"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                </div>
              </div>
              <div className="p-6 border-t border-border">
                <div className="flex gap-3 pt-0">
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-industrial-blue hover:bg-industrial-blue-dark text-white rounded-[var(--radius-button)] py-2 transition-all duration-200"
                  >
                    保存
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 rounded-[var(--radius-button)] py-2 transition-all duration-200"
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Show placeholder when no record selected and not editing
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="mb-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  {/* Background circle with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-medium-gray rounded-full opacity-80" />
                  {/* Icon container */}
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Database className="w-12 h-12 text-muted-foreground" />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--color-industrial-blue)] rounded-full flex items-center justify-center">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-foreground mb-3">危废信息录入系统</h3>
                <p className="text-muted-foreground mb-2 max-w-xs mx-auto leading-relaxed">
                  管理和录入工业危废物品的详细信息
                </p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  包括基础信息、分类信息、成分信息和安全预防措施
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[var(--color-industrial-blue)] rounded-full opacity-60" />
                  <span>选择左侧列表中的记录进行编辑</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[var(--color-safety-green)] rounded-full opacity-60" />
                  <span>点击"添加"按钮创建新的危废记录</span>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="mt-8">
                <Button
                  onClick={handleAddNew}
                  className="bg-industrial-blue hover:bg-industrial-blue-dark text-white px-6 py-2 rounded-[var(--radius-button)] transition-all duration-200 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  开始录入
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
