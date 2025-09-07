import { Building } from "lucide-react";

export function BrandHeader() {
  return (
    <header className="w-full flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
      {/* Logo区域 */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[--color-industrial-blue] to-[--color-industrial-blue-dark] flex items-center justify-center shadow-lg">
          <Building className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {/* 产品名称区域 */}
      <div className="text-right">
        <h1 className="text-2xl font-semibold text-slate-900 leading-tight">
          危废标签打印
        </h1>
        <p className="text-sm text-slate-600 mt-1 tracking-wide">
          Hazardous Waste Label Printing
        </p>
      </div>
    </header>
  );
}