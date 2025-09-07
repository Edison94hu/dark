import { useState } from "react";
import { Save, Calendar } from "lucide-react";

interface LabelFormData {
  wasteType: string;
  wasteCode: string;
  weight: string;
  unit: string;
  batchNumber: string;
  operator: string;
  generateTime: string;
}

interface IOSLabelFormProps {
  onSave: (data: LabelFormData) => void;
}

export function IOSLabelForm({ onSave }: IOSLabelFormProps) {
  const [formData, setFormData] = useState<LabelFormData>({
    wasteType: "",
    wasteCode: "",
    weight: "",
    unit: "kg",
    batchNumber: "",
    operator: "",
    generateTime: ""
  });

  const wasteTypes = [
    "废矿物油与含矿物油废物",
    "废酸",
    "废碱",
    "废有机溶剂与含有机溶剂废物",
    "含铜废物",
    "含锌废物"
  ];

  const units = ["kg", "t", "L", "m³"];

  const handleInputChange = (field: keyof LabelFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isFormValid = formData.wasteType && formData.wasteCode && formData.weight;

  return (
    <div className="bg-card rounded-[var(--radius-card)] p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">标签信息</h3>
      
      <div className="space-y-6">
        {/* 危废种类 */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            危废种类 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.wasteType}
            onChange={(e) => handleInputChange("wasteType", e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius-input)] focus:ring-2 focus:ring-industrial-blue focus:border-transparent outline-none transition-all"
          >
            <option value="">请选择危废种类</option>
            {wasteTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* 危废代码 */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            危废代码 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="如：900-041-49"
            value={formData.wasteCode}
            onChange={(e) => handleInputChange("wasteCode", e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius-input)] focus:ring-2 focus:ring-industrial-blue focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* 重量和单位 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              重量 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius-input)] focus:ring-2 focus:ring-industrial-blue focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">单位</label>
            <select
              value={formData.unit}
              onChange={(e) => handleInputChange("unit", e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius-input)] focus:ring-2 focus:ring-industrial-blue focus:border-transparent outline-none transition-all"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 批次号 */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">批次号</label>
          <input
            type="text"
            placeholder="自动生成或手动输入"
            value={formData.batchNumber}
            onChange={(e) => handleInputChange("batchNumber", e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius-input)] focus:ring-2 focus:ring-industrial-blue focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* 经办人 */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">经办人</label>
          <input
            type="text"
            placeholder="请输入经办人姓名"
            value={formData.operator}
            onChange={(e) => handleInputChange("operator", e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius-input)] focus:ring-2 focus:ring-industrial-blue focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* 产生时间 */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">产生时间</label>
          <div className="relative">
            <input
              type="datetime-local"
              value={formData.generateTime}
              onChange={(e) => handleInputChange("generateTime", e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius-input)] focus:ring-2 focus:ring-industrial-blue focus:border-transparent outline-none transition-all"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-[var(--radius-button)] font-semibold transition-all duration-200 ${
            isFormValid
              ? 'bg-industrial-blue text-white hover:bg-industrial-blue-dark shadow-lg hover:shadow-xl'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Save className="w-5 h-5" />
          保存标签信息
        </button>
      </div>
    </div>
  );
}
