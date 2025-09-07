import { Badge } from "./ui/badge";

interface FooterProps {
  version: string;
  environment: "PROD" | "UAT" | "DEV";
}

export function Footer({ version, environment }: FooterProps) {
  const getEnvironmentStyle = (env: string) => {
    switch (env) {
      case "PROD":
        return "bg-[--color-safety-green]/10 text-[--color-safety-green] border-[--color-safety-green]/20";
      case "UAT":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "DEV":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <footer className="w-full p-6 bg-white/50 backdrop-blur-sm border-t border-slate-200/50">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* 版本和环境信息 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 font-mono">
            v{version}
          </span>
          <Badge 
            variant="outline" 
            className={`text-xs font-semibold ${getEnvironmentStyle(environment)}`}
          >
            {environment}
          </Badge>
        </div>
        
        {/* 版权信息 */}
        <div className="text-xs text-slate-400 space-y-1">
          <p>© 2024 危废标签打印系统</p>
          <p>Hazardous Waste Management System</p>
        </div>
      </div>
    </footer>
  );
}