import { BarChart3, Database, User, Clipboard, TruckIcon } from "lucide-react";

export type NavigationTab = "collection" | "statistics" | "devices" | "profile";

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: "collection" as NavigationTab,
      label: "数据采集",
      icon: Clipboard,
      description: "危废数据采集与标签打印"
    },
    {
      id: "statistics" as NavigationTab,
      label: "历史记录",
      icon: Database,
      description: "查看打印记录和历史数据"
    },
    {
      id: "devices" as NavigationTab,
      label: "转移出库",
      icon: TruckIcon,
      description: "危废转移出库管理与扫码识别"
    },
    {
      id: "profile" as NavigationTab,
      label: "个人中心",
      icon: User,
      description: "用户设置和系统配置"
    }
  ];

  return (
    <div className="bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="flex h-[72px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300
                hover:bg-accent/50 relative group
                ${isActive 
                  ? 'text-industrial-blue' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-industrial-blue rounded-b-full 
                               shadow-lg shadow-industrial-blue/50" />
              )}
              
              {/* Icon with enhanced styling */}
              <div className={`
                p-1.5 rounded-lg transition-all duration-300
                ${isActive 
                  ? 'bg-industrial-blue/20 shadow-lg shadow-industrial-blue/30 scale-105' 
                  : 'group-hover:bg-accent/30'
                }
              `}>
                <Icon className={`
                  w-[22px] h-[22px] transition-all duration-300
                  ${isActive ? 'scale-110 filter drop-shadow-sm' : 'group-hover:scale-105'}
                `} />
              </div>
              
              {/* Label */}
              <span className={`
                text-[15px] font-semibold tracking-wide transition-all duration-300
                ${isActive ? 'font-bold text-shadow-sm' : ''}
              `}>
                {tab.label}
              </span>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 
                            bg-popover text-popover-foreground text-xs rounded-lg shadow-lg backdrop-blur-sm
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none whitespace-nowrap border border-border z-50">
                {tab.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}