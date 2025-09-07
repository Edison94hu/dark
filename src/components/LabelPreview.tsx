import { QrCode } from "lucide-react";
import { WasteType } from "./WasteTypeCard";
import { WeightUnit, LabelSize } from "./WeightOperationPanel";

interface LabelPreviewProps {
  wasteType: WasteType | null;
  weight: string;
  weightUnit: WeightUnit;
  labelSize: LabelSize;
}

export function LabelPreview({ wasteType, weight, weightUnit, labelSize }: LabelPreviewProps) {
  // Get current date
  const currentDate = new Date().toLocaleDateString('zh-CN');
  
  // Generate digital identification code
  const digitalId = wasteType ? `DW${wasteType.code.replace(/-/g, '')}${Date.now().toString().slice(-6)}` : '';

  // Mock company data
  const companyData = {
    name: "华东化工集团有限公司",
    contact: "张经理",
    phone: "021-12345678",
    address: "上海市浦东新区化工路123号"
  };

  // Convert weight for display
  const getDisplayWeight = () => {
    if (!weight) return "";
    const numWeight = parseFloat(weight);
    if (weightUnit === "T") {
      // Weight is stored in KG internally, convert to T for display
      return `${(numWeight / 1000).toFixed(3)} T`;
    } else {
      return `${numWeight.toFixed(2)} KG`;
    }
  };

  // Get text size based on label size - optimized for maximum preview display
  const getTextSizes = () => {
    const textSizeMap = {
      "100*100": {
        header: "text-4xl",
        field: "text-lg",
        content: "text-base",
        minHeight: "min-h-[40px]"
      },
      "100*80": {
        header: "text-4xl", 
        field: "text-lg",
        content: "text-base",
        minHeight: "min-h-[36px]"
      },
      "100*70": {
        header: "text-3xl",
        field: "text-lg",
        content: "text-base",
        minHeight: "min-h-[32px]"
      },
      "100*60": {
        header: "text-3xl",
        field: "text-base",
        content: "text-sm",
        minHeight: "min-h-[28px]"
      },
      "150*150": {
        header: "text-5xl",
        field: "text-xl",
        content: "text-lg",
        minHeight: "min-h-[48px]"
      },
      "200*200": {
        header: "text-6xl",
        field: "text-2xl",
        content: "text-xl",
        minHeight: "min-h-[56px]"
      }
    };
    return textSizeMap[labelSize];
  };

  // Waste type specific data mapping
  const getWasteDetails = (wasteType: WasteType | null) => {
    if (!wasteType) return null;
    
    const wasteDetailsMap: Record<string, any> = {
      "1": {
        category: "HW08 废矿物油与含矿物油废物",
        form: "液态",
        hazardProperty: "T,I",
        mainComponent: "矿物油、润滑油基础油",
        harmfulComponent: "多环芳烃、重金属离子",
        precautions: "远离火源，防止泄漏，穿戴防护用品"
      },
      "2": {
        category: "HW34 废酸",
        form: "液态",
        hazardProperty: "C",
        mainComponent: "硫酸、盐酸、硝酸",
        harmfulComponent: "强酸性物质",
        precautions: "防止接触皮肤，远离碱性物质"
      },
      "3": {
        category: "HW35 废碱",
        form: "液态",
        hazardProperty: "C",
        mainComponent: "氢氧化钠、氢氧化钾",
        harmfulComponent: "强碱性物质",
        precautions: "防止接触皮肤，远离酸性物质"
      },
      "4": {
        category: "HW06 废有机溶剂与含有机溶剂废物",
        form: "液态",
        hazardProperty: "T,I,F",
        mainComponent: "甲苯、二甲苯、丙酮",
        harmfulComponent: "有机溶剂、挥发性有机物",
        precautions: "通风良好环境存放，远离火源"
      }
    };

    return wasteDetailsMap[wasteType.id] || {
      category: `HW${wasteType.code.split('-')[0]} ${wasteType.name}`,
      form: "固态",
      hazardProperty: "T",
      mainComponent: "待检测确认",
      harmfulComponent: "待检测确认",
      precautions: "按危废管理要求处理"
    };
  };

  const wasteDetails = getWasteDetails(wasteType);
  const textSizes = getTextSizes();

  return (
    <div className="w-full h-full">
      <div className="w-full h-full bg-orange-200 border-4 border-black overflow-hidden flex flex-col">
            
        {/* Header - Fixed height */}
        <div className="border-b-2 border-black px-2 py-1 text-center flex-shrink-0 bg-orange-300">
          <h1 className={`${textSizes.header} font-bold text-black leading-tight`}>危险废物</h1>
        </div>

        {/* Main Content - 按照原图正确布局：左右两列结构 */}
        <div className="flex-1 flex min-h-0 text-black" style={{color: 'black'}}>
        
          {/* 左列：主要信息字段 */}
          <div className="flex-[2] flex flex-col border-r-2 border-black">
            
            {/* Row 1: 废物名称 */}
            <div className="border-b-2 border-black p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '12%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>废物名称:</div>
              <div className={`${textSizes.content} leading-tight break-words overflow-hidden text-black`}>{wasteType?.name || "未选择"}</div>
            </div>

            {/* Row 2: 废物类别 */}
            <div className="border-b-2 border-black p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '9%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>废物类别:</div>
              <div className={`${textSizes.content} leading-tight break-words overflow-hidden text-black`}>{wasteDetails?.category || "-"}</div>
            </div>

            {/* Row 3: 废物代码 | 废物形态 */}
            <div className="flex border-b-2 border-black" style={{ height: '9%' }}>
              <div className="flex-1 border-r-2 border-black p-1.5 flex flex-col justify-center overflow-hidden">
                <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>废物代码:</div>
                <div className={`${textSizes.content} font-mono leading-tight overflow-hidden text-black`}>{wasteType?.code || "-"}</div>
              </div>
              <div className="flex-1 p-1.5 flex flex-col justify-center overflow-hidden">
                <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>废物形态:</div>
                <div className={`${textSizes.content} leading-tight overflow-hidden text-black`}>{wasteDetails?.form || "-"}</div>
              </div>
            </div>

            {/* Row 4: 主要成分 */}
            <div className="border-b-2 border-black p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '15%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>主要成分:</div>
              <div className={`${textSizes.content} leading-tight break-words overflow-hidden text-black`}>{wasteDetails?.mainComponent || "-"}</div>
            </div>

            {/* Row 5: 有害成分 */}
            <div className="border-b-2 border-black p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '15%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>有害成分:</div>
              <div className={`${textSizes.content} leading-tight break-words overflow-hidden text-black`}>{wasteDetails?.harmfulComponent || "-"}</div>
            </div>

            {/* Row 6: 注意事项 */}
            <div className="border-b-2 border-black p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '15%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>注意事项:</div>
              <div className={`${textSizes.content} leading-tight break-words overflow-hidden text-black`}>{wasteDetails?.precautions || "-"}</div>
            </div>

            {/* Row 7: 数字识别码 */}
            <div className="border-b-2 border-black p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '9%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>数字识别码:</div>
              <div className={`${textSizes.content} font-mono leading-tight overflow-hidden text-black`}>{digitalId || "-"}</div>
            </div>

            {/* Row 8: 产生/收集单位 */}
            <div className="border-b-2 border-black p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '9%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>产生/收集单位:</div>
              <div className={`${textSizes.content} leading-tight break-words overflow-hidden text-black`}>{companyData.name}</div>
            </div>

            {/* Row 9: 联系人和联系方式 */}
            <div className="border-b-2 border-black p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '9%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>联系人和联系方式:</div>
              <div className={`${textSizes.content} leading-tight overflow-hidden text-black`}>{companyData.contact} {companyData.phone}</div>
            </div>

            {/* Row 10: 产生日期 | 废物重量 */}
            <div className="flex border-b-2 border-black" style={{ height: '9%' }}>
              <div className="flex-1 border-r-2 border-black p-1.5 flex flex-col justify-center overflow-hidden">
                <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>产生日期:</div>
                <div className={`${textSizes.content} leading-tight overflow-hidden text-black`}>{currentDate}</div>
              </div>
              <div className="flex-1 p-1.5 flex flex-col justify-center overflow-hidden">
                <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>废物重量:</div>
                <div className={`${textSizes.content} font-semibold text-red-600 leading-tight overflow-hidden`}>
                  {getDisplayWeight() || `- ${weightUnit}`}
                </div>
              </div>
            </div>

            {/* Row 11: 备注 */}
            <div className="p-1.5 flex flex-col justify-center overflow-hidden" style={{ height: '8%' }}>
              <div className={`font-bold ${textSizes.field} mb-0.5 text-black`}>备注:</div>
              <div className={`${textSizes.content} leading-tight break-words overflow-hidden text-black`}>-</div>
            </div>
            
          </div>

          {/* 右列：危险特性大区域 */}
          <div className="flex-1 flex flex-col">
            
            {/* 危险特性 - 占据右侧大部分空间 */}
            <div className="flex-1 border-b-2 border-black p-2 flex flex-col justify-start overflow-hidden">
              <div className={`font-bold ${textSizes.field} mb-2 text-center text-black`}>危险特性</div>
              <div className={`${textSizes.content} leading-relaxed text-center overflow-hidden text-black`}>
                {wasteDetails?.hazardProperty || "-"}
              </div>
            </div>

            {/* QR码区域 - 占据右侧下部空间 */}
            <div className="h-24 p-2 flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-black bg-white flex items-center justify-center">
                <QrCode className="w-16 h-16 text-black" />
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}