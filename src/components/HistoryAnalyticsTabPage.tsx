import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Database, TrendingUp } from "lucide-react";
import { HistoryRecordsPage } from "./HistoryRecordsPage";
import { DataAnalyticsPanel } from "./DataAnalyticsPanel";

type TabType = 'history' | 'analytics';

export function HistoryAnalyticsTabPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab: TabType = location.pathname.includes('/statistics/analytics') ? 'analytics' : 'history';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const tabs = [
    {
      id: 'history' as TabType,
      label: '历史记录',
      icon: Database,
      description: '查看打印记录和历史数据'
    },
    {
      id: 'analytics' as TabType,
      label: '数据分析',
      icon: TrendingUp,
      description: '统计分析和数据可视化'
    }
  ];

  // Initialize and sync active tab from URL path
  useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path[0] !== 'statistics') return;
    const sub = path[1];
    const next: TabType = sub === 'analytics' ? 'analytics' : 'history';
    setActiveTab((prev) => (prev === next ? prev : next));
  }, [location.pathname]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
        {/* Tab Header (inside content) */}
        <div className="flex-shrink-0 bg-secondary/60 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center gap-6">
            {/* Tab Buttons */}
            <div className="flex bg-muted rounded-xl p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      const to = tab.id === 'history' ? '/statistics/history' : '/statistics/analytics';
                      if (location.pathname !== to) navigate(to);
                    }}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300
                      ${isActive 
                        ? 'bg-industrial-blue text-white shadow-lg shadow-industrial-blue/30 transform scale-[1.02]' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Description */}
            <div className="text-sm text-muted-foreground ml-4">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {activeTab === 'history' ? (
            <HistoryRecordsPage />
          ) : (
            <DataAnalyticsPanel />
          )}
        </div>
    </div>
  );
}

// Sync tab with URL
// Keep it here to avoid changing child components structure
export function HistoryAnalyticsTabPageURLSync() {
  return null;
}
