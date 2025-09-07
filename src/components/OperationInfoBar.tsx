interface OperationInfoBarProps {
  companyName?: string;
  operatorName?: string;
}

export function OperationInfoBar({
  companyName = "杭州示例化工有限公司",
  operatorName = "张操作员"
}: OperationInfoBarProps) {
  return (
    <div className="w-full flex items-center justify-between py-4 px-1">
      {/* Left Side - Company Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-safety-green rounded-full"></div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground/70 uppercase tracking-wider font-medium leading-none">企业</span>
            <span className="text-base text-foreground font-medium mt-1 leading-none" title={companyName}>
              {companyName}
            </span>
          </div>
        </div>
      </div>
      
      {/* Right Side - Operator Info */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-right">
          <span className="text-xs text-muted-foreground/70 uppercase tracking-wider font-medium leading-none">操作员</span>
          <span className="text-base text-foreground font-medium mt-1 leading-none">
            {operatorName}
          </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-safety-green animate-pulse ml-2"></div>
      </div>
    </div>
  );
}