import { Download, TrendingUp, PieChart, BarChart3, Activity, Calculator } from "lucide-react";
import { Button } from "./ui/button";
// Removed useTheme import - using light mode only
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  Tooltip, 
  Legend,
  LineChart,
  Line 
} from "recharts";

export function DataAnalyticsPanel() {
  // Light mode colors only
  const chartColors = {
    grid: '#E5E7EB',
    axis: '#6B7280'
  };
  // Chart data for last 7 days
  const barChartData = [
    { date: 'Aug 14', weight: 120, day: '08-14' },
    { date: 'Aug 15', weight: 150, day: '08-15' },
    { date: 'Aug 16', weight: 90, day: '08-16' },
    { date: 'Aug 17', weight: 200, day: '08-17' },
    { date: 'Aug 18', weight: 180, day: '08-18' },
    { date: 'Aug 19', weight: 160, day: '08-19' },
    { date: 'Aug 20', weight: 140, day: '08-20' }
  ];

  const pieChartData = [
    { name: '液体废物', value: 40, color: '#4880F0' },
    { name: '固体废物', value: 25, color: '#34D399' },
    { name: '包装废物', value: 20, color: '#F59E0B' },
    { name: '活性炭废物', value: 15, color: '#A855F7' }
  ];

  // Line chart data for different waste types over time
  const lineChartData = [
    { date: '08-14', 废矿物油: 45, 废酸: 30, 废碱: 25, 有机溶剂: 20 },
    { date: '08-15', 废矿物油: 52, 废酸: 35, 废碱: 28, 有机溶剂: 35 },
    { date: '08-16', 废矿物油: 38, 废酸: 25, 废碱: 15, 有机溶剂: 12 },
    { date: '08-17', 废矿物油: 68, 废酸: 45, 废碱: 42, 有机溶剂: 45 },
    { date: '08-18', 废矿物油: 55, 废酸: 40, 废碱: 38, 有机溶剂: 47 },
    { date: '08-19', 废矿物油: 48, 废酸: 38, 废碱: 32, 有机溶剂: 42 },
    { date: '08-20', 废矿物油: 42, 废酸: 32, 废碱: 28, 有机溶剂: 38 }
  ];

  // Total summary data for the date range
  const totalSummaryData = {
    totalWeight: 1040,
    wasteTypes: [
      { name: '废矿物油与含矿物油废物', weight: 416, percentage: 40.0, color: '#4880F0' },
      { name: '废酸', weight: 286, percentage: 27.5, color: '#34D399' },
      { name: '废碱', weight: 208, percentage: 20.0, color: '#F59E0B' },
      { name: '废有机溶剂与含有机溶剂废物', weight: 130, percentage: 12.5, color: '#A855F7' }
    ]
  };

  const handleExportData = () => {
    // Mock export functionality
    console.log('Exporting data...');
    alert('数据导出功能：将生成Excel报表文件');
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-popover-foreground text-sm">{`日期: ${label}`}</p>
          <p className="text-industrial-blue font-semibold">
            {`总重量: ${payload[0].value} KG`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-popover-foreground text-sm">{payload[0].name}</p>
          <p className="font-semibold" style={{ color: payload[0].payload.color }}>
            {`占比: ${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for line chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-popover-foreground text-sm font-medium mb-2">{`日期: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} KG`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Analysis Header */}
      <div className="flex-shrink-0 bg-secondary/60 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-safety-green" />
            <h2 className="text-lg font-semibold text-foreground">数据分析</h2>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
              最近7天
            </span>
          </div>
          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            导出报表
          </Button>
        </div>
      </div>

      {/* Charts Container */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Total Summary Card - Numerical Display */}
          <div className="bg-card/80 border border-border rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-semibold text-foreground">总量统计表</h3>
              </div>
              <div className="text-sm text-muted-foreground">KG</div>
            </div>
            
            <div className="space-y-4">
              {/* Total Weight Display */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {totalSummaryData.totalWeight.toLocaleString()}
                </div>
                <div className="text-sm text-purple-500 font-medium">总处理量 (KG)</div>
              </div>
              
              {/* Detailed Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">分类明细</h4>
                {totalSummaryData.wasteTypes.map((waste, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: waste.color }}
                      />
                      <span className="text-sm text-foreground font-medium truncate" title={waste.name}>
                        {waste.name.length > 12 ? waste.name.substring(0, 12) + '...' : waste.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">
                        {waste.weight} KG
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {waste.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line Chart - Waste Type Production Over Time */}
          <div className="bg-card/80 border border-border rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-safety-green" />
                <h3 className="text-base font-semibold text-foreground">危废产量趋势</h3>
              </div>
              <div className="text-sm text-muted-foreground">KG</div>
            </div>
            
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4880F0" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#4880F0" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="lineGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#34D399" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="lineGradient3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="lineGradient4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#A855F7" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis 
                    dataKey="date" 
                    stroke={chartColors.axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke={chartColors.axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{value}</span>
                    )}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="废矿物油" 
                    stroke="#4880F0" 
                    strokeWidth={2}
                    dot={{ fill: '#4880F0', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#4880F0', strokeWidth: 2, fill: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="废酸" 
                    stroke="#34D399" 
                    strokeWidth={2}
                    dot={{ fill: '#34D399', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#34D399', strokeWidth: 2, fill: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="废碱" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="有机溶剂" 
                    stroke="#A855F7" 
                    strokeWidth={2}
                    dot={{ fill: '#A855F7', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#A855F7', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Daily Totals */}
          <div className="bg-card/80 border border-border rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-industrial-blue" />
                <h3 className="text-base font-semibold text-foreground">日处理量统计</h3>
              </div>
              <div className="text-sm text-muted-foreground">KG</div>
            </div>
            
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4880F0" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#4880F0" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis 
                    dataKey="day" 
                    stroke={chartColors.axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke={chartColors.axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="weight" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    stroke="#4880F0"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Waste Type Proportions */}
          <div className="bg-card/80 border border-border rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-safety-green" />
                <h3 className="text-base font-semibold text-foreground">废物类型占比</h3>
              </div>
              <div className="text-sm text-muted-foreground">%</div>
            </div>
            
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <defs>
                    {pieChartData.map((entry, index) => (
                      <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#pieGradient${index})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontSize: '12px' }}>{value}</span>
                    )}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-industrial-blue/10 to-industrial-blue/5 border border-industrial-blue/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-industrial-blue">1,040</div>
            <div className="text-sm text-muted-foreground">总重量 (KG)</div>
          </div>
          <div className="bg-gradient-to-br from-safety-green/10 to-safety-green/5 border border-safety-green/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-safety-green">8</div>
            <div className="text-sm text-muted-foreground">处理批次</div>
          </div>
          <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 border border-orange-400/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">4</div>
            <div className="text-sm text-muted-foreground">废物类型</div>
          </div>
          <div className="bg-gradient-to-br from-purple-400/10 to-purple-400/5 border border-purple-400/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">148.6</div>
            <div className="text-sm text-muted-foreground">日均 (KG)</div>
          </div>
        </div>
      </div>
    </div>
  );
}