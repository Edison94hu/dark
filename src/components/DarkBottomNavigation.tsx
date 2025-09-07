import { BarChart3, Database, User, Clipboard, Settings } from "lucide-react";

export type NavigationTab = "collection" | "statistics" | "devices" | "profile";

interface DarkBottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export function DarkBottomNavigation({ activeTab, onTabChange }: DarkBottomNavigationProps) {
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
      label: "设备管理",
      icon: Settings,
      description: "设备连接状态与配置管理"
    },
    {
      id: "profile" as NavigationTab,
      label: "个人中心",
      icon: User,
      description: "用户设置和系统配置"
    }
  ];

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-700/50">
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
                hover:bg-gray-700/50 relative group
                ${isActive 
                  ? 'text-industrial-blue' 
                  : 'text-gray-400/60 hover:text-gray-300'
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
                  : 'group-hover:bg-gray-600/30'
                }
              `}>
                <Icon className={`
                  w-[22px] h-[22px] transition-all duration-300
                  ${isActive ? 'scale-110 filter drop-shadow-sm' : 'group-hover:scale-105'}
                `} />
              </div>
              
              {/* Label */}
              <span className={`
                text-[12px] font-medium tracking-wide transition-all duration-300
                ${isActive ? 'font-semibold text-shadow-sm' : ''}
              `}>
                {tab.label}
              </span>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 
                            bg-gray-800/95 text-white text-xs rounded-lg shadow-lg backdrop-blur-sm
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none whitespace-nowrap border border-gray-600/50 z-50">
                {tab.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800/95" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}