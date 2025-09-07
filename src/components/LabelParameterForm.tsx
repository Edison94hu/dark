import { useState } from "react";
import { Calendar, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface LabelParameterFormProps {
  onSave: (data: LabelFormData) => void;
}

export interface LabelFormData {
  wasteType: string;
  wasteCode: string;
  generator: string;
  generateTime: string;
  weight: string;
  unit: string;
  batchNumber: string;
  operator: string;
  remarks: string;
}

export function LabelParameterForm({ onSave }: LabelParameterFormProps) {
  const [formData, setFormData] = useState<LabelFormData>({
    wasteType: "",
    wasteCode: "",
    generator: "",
    generateTime: "",
    weight: "",
    unit: "kg",
    batchNumber: "",
    operator: "",
    remarks: ""
  });

  const wasteTypes = [
    "废矿物油与含矿物油废物",
    "废酸",
    "废碱", 
    "废有机溶剂与含有机溶剂废物",
    "含铜废物",
    "含锌废物",
    "含铅废物",
    "含铬废物",
    "含镍废物"
  ];

  const units = ["kg", "t", "L", "m³"];

  const handleInputChange = (field: keyof LabelFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isFormValid = formData.wasteType && formData.wasteCode && formData.generator && formData.weight;

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-foreground">标签参数</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 危废种类 */}
          <div className="space-y-2">
            <Label htmlFor="wasteType" className="text-foreground">
              危废种类 <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.wasteType} onValueChange={(value) => handleInputChange("wasteType", value)}>
              <SelectTrigger className="h-12 bg-input border-border">
                <SelectValue placeholder="请选择危废种类" />
              </SelectTrigger>
              <SelectContent>
                {wasteTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 危废代码 */}
          <div className="space-y-2">
            <Label htmlFor="wasteCode" className="text-foreground">
              危废代码 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="wasteCode"
              placeholder="如：900-041-49"
              value={formData.wasteCode}
              onChange={(e) => handleInputChange("wasteCode", e.target.value)}
              className="h-12 bg-input border-border"
            />
          </div>

          {/* 产生单位 */}
          <div className="space-y-2">
            <Label htmlFor="generator" className="text-foreground">
              产生单位 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="generator"
              placeholder="请输入产生单位名称"
              value={formData.generator}
              onChange={(e) => handleInputChange("generator", e.target.value)}
              className="h-12 bg-input border-border"
            />
          </div>

          {/* 产生时间 */}
          <div className="space-y-2">
            <Label htmlFor="generateTime" className="text-foreground">
              产生时间
            </Label>
            <div className="relative">
              <Input
                id="generateTime"
                type="datetime-local"
                value={formData.generateTime}
                onChange={(e) => handleInputChange("generateTime", e.target.value)}
                className="h-12 bg-input border-border"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* 重量和单位 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="weight" className="text-foreground">
                重量 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="h-12 bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-foreground">单位</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger className="h-12 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 批次号 */}
          <div className="space-y-2">
            <Label htmlFor="batchNumber" className="text-foreground">批次号</Label>
            <Input
              id="batchNumber"
              placeholder="自动生成或手动输入"
              value={formData.batchNumber}
              onChange={(e) => handleInputChange("batchNumber", e.target.value)}
              className="h-12 bg-input border-border"
            />
          </div>

          {/* 经办人 */}
          <div className="space-y-2">
            <Label htmlFor="operator" className="text-foreground">经办人</Label>
            <Input
              id="operator"
              placeholder="请输入经办人姓名"
              value={formData.operator}
              onChange={(e) => handleInputChange("operator", e.target.value)}
              className="h-12 bg-input border-border"
            />
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="text-foreground">备注</Label>
            <Textarea
              id="remarks"
              placeholder="请输入备注信息（可选）"
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              className="min-h-20 bg-input border-border resize-none"
            />
          </div>

          {/* 保存按钮 */}
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-12 bg-[--color-industrial-blue] hover:bg-[--color-industrial-blue-dark] disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            保存参数
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
