import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  User,
  Edit,
  Settings,
  Shield,
  FileText,
  Users,
  Lock,
  Phone,
  Mail,
  MapPin,
  Building,
  Camera,
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { WasteInfoPage } from "./WasteInfoPage";
import { SubAccountManagementPage } from "./SubAccountManagementPage";
import { DeviceManagementPage } from "./DeviceManagementPage";
import { SystemSettingsPage } from "./SystemSettingsPage";

type PersonalCenterTab = "basicInfo" | "wasteInfo" | "subAccounts" | "deviceManagement" | "systemSettings";

interface ServiceCycle {
  totalDays: number;
  daysServed: number;
  daysRemaining: number;
  startDate: string;
  endDate: string;
}

export function PersonalCenterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<PersonalCenterTab>("basicInfo");
  const [isEditing, setIsEditing] = useState({
    personal: false,
    company: false
  });

  // User data
  const [personalInfo, setPersonalInfo] = useState({
    name: "张工程师",
    phone: "138****8888",
    email: "zhang.engineer@company.com",
    role: "系统管理员",
    avatar: null as string | null
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "华东化工集团有限公司",
    socialCreditCode: "91310000123456789X",
    pollutionPermitNumber: "91310000123456789X001P",
    address: "上海市浦东新区张江高科技园区科苑路201号",
    contactPerson: "李总经理",
    contactPhone: "021-5888-8888",
    companyLogo: null as string | null
  });

  const [appInfo] = useState({
    version: "v1.2.3",
    lastUpdate: "2024-03-15 14:30",
    buildNumber: "202403150001"
  });

  const [serviceCycle, setServiceCycle] = useState<ServiceCycle>(() => {
    // Calculate service cycle based on start date
    const startDate = new Date('2024-01-01');
    const currentDate = new Date();
    const totalDays = 365; // One year service cycle
    const daysServed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysServed);
    
    return {
      totalDays,
      daysServed,
      daysRemaining,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };
  });

  // Update service cycle daily
  useEffect(() => {
    const updateCycle = () => {
      const startDate = new Date(serviceCycle.startDate);
      const currentDate = new Date();
      const daysServed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, serviceCycle.totalDays - daysServed);
      
      setServiceCycle(prev => ({
        ...prev,
        daysServed,
        daysRemaining
      }));
    };

    // Update immediately
    updateCycle();
    
    // Update daily at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      updateCycle();
      const intervalId = setInterval(updateCycle, 24 * 60 * 60 * 1000); // Update daily
      return () => clearInterval(intervalId);
    }, msUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, [serviceCycle.startDate, serviceCycle.totalDays]);

  const tabs = [
    { id: "basicInfo", label: "基础信息", icon: User },
    { id: "wasteInfo", label: "危废录入", icon: FileText },
    { id: "subAccounts", label: "子账户", icon: Users },
    { id: "deviceManagement", label: "设备管理", icon: Settings },
    { id: "systemSettings", label: "系统设置", icon: Shield }
  ];

  // Map between tab ids and URL slugs
  const tabToSlug: Record<PersonalCenterTab, string> = {
    basicInfo: "basic-info",
    wasteInfo: "waste-info",
    subAccounts: "sub-accounts",
    deviceManagement: "device-management",
    systemSettings: "system-settings",
  };
  const slugToTab: Record<string, PersonalCenterTab> = {
    "basic-info": "basicInfo",
    "waste-info": "wasteInfo",
    "sub-accounts": "subAccounts",
    "device-management": "deviceManagement",
    "system-settings": "systemSettings",
  };

  // Keep internal tab in sync with URL
  useEffect(() => {
    // Expect path like /profile or /profile/:section
    const parts = location.pathname.split("/").filter(Boolean);
    const section = parts[0] === "profile" ? parts[1] : undefined;
    const next = section && slugToTab[section] ? slugToTab[section] : "basicInfo";
    setActiveTab((prev) => (prev === next ? prev : next));
  }, [location.pathname]);

  const navigateToTab = (id: PersonalCenterTab) => {
    setActiveTab(id);
    const slug = tabToSlug[id];
    const to = `/profile/${slug}`;
    if (location.pathname !== to) navigate(`${to}${location.search || ''}`);
  };

  const handlePersonalEdit = () => {
    setIsEditing(prev => ({ ...prev, personal: !prev.personal }));
  };

  const handleCompanyEdit = () => {
    setIsEditing(prev => ({ ...prev, company: !prev.company }));
  };

  const handlePersonalInfoChange = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyInfoChange = (field: keyof typeof companyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = () => {
    // Simulate avatar upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setPersonalInfo(prev => ({ ...prev, avatar: imageUrl }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLogoUpload = () => {
    // Simulate logo upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setCompanyInfo(prev => ({ ...prev, companyLogo: imageUrl }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleCheckUpdate = () => {
    // Simulate update check
    alert("正在检查更新...\n当前版本已是最新版本");
  };

  const formatPhoneNumber = (phone: string) => {
    // Simple phone number formatting
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const formatCreditCode = (code: string) => {
    // Format credit code with spaces
    return code.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub Navigation Bar (Header inside container) */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border">
        <div className="flex items-center bg-card rounded-[var(--radius-card)] shadow-sm border border-border overflow-hidden" style={{ height: '48px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id as PersonalCenterTab)}
                className={`flex-1 flex items-center justify-center gap-2 h-full transition-all duration-200 relative ${
                  isActive 
                    ? 'text-[var(--color-industrial-blue)] font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[var(--color-industrial-blue)] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content inside container */}
      <div className="flex-1 overflow-auto p-6">
      {activeTab === "wasteInfo" ? (
        <WasteInfoPage />
      ) : activeTab === "subAccounts" ? (
        <SubAccountManagementPage />
      ) : activeTab === "deviceManagement" ? (
        <DeviceManagementPage />
      ) : activeTab === "systemSettings" ? (
        <SystemSettingsPage />
      ) : (
        <div className="space-y-6 pb-6">
          {/* Top Row - Personal Info and Company Info */}
          <div className="grid grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <div className="bg-card rounded-[var(--radius-card)] shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-foreground">个人信息</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePersonalEdit}
                className="border-border text-muted-foreground hover:border-[var(--color-industrial-blue)] hover:text-[var(--color-industrial-blue)] text-sm px-3 py-1"
              >
                <Edit className="w-3 h-3 mr-1" />
                {isEditing.personal ? '保存' : '编辑'}
              </Button>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-[var(--color-border)]">
                  <AvatarImage src={personalInfo.avatar || undefined} alt={personalInfo.name} />
                  <AvatarFallback className="bg-muted text-[var(--color-industrial-blue)] text-xl font-medium">
                    {personalInfo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing.personal && (
                  <button
                    onClick={handleAvatarUpload}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--color-industrial-blue)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-industrial-blue-dark)] transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Personal Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-20">姓名</label>
                <div className="flex-1 ml-4">
                  {isEditing.personal ? (
                    <Input
                      value={personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      className="text-sm border-border focus:border-[var(--color-industrial-blue)] bg-input"
                    />
                  ) : (
                    <span className="text-foreground text-sm">{personalInfo.name}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-20">手机号</label>
                <div className="flex-1 ml-4">
                  {isEditing.personal ? (
                    <Input
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="text-sm border-border focus:border-[var(--color-industrial-blue)] bg-input"
                      placeholder="请输入手机号"
                    />
                  ) : (
                    <span className="text-foreground text-sm">{personalInfo.phone}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-20">邮箱</label>
                <div className="flex-1 ml-4">
                  {isEditing.personal ? (
                    <div className="relative">
                      <Input
                        value={personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        className="text-sm border-border focus:border-[var(--color-industrial-blue)] bg-input pl-8"
                        placeholder="user@example.com"
                      />
                      <Mail className="w-4 h-4 text-muted-foreground absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>
                  ) : (
                    <span className="text-foreground text-sm">{personalInfo.email}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-20">角色</label>
                <div className="flex-1 ml-4 flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">{personalInfo.role}</span>
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Company Information Card */}
          <div className="bg-card rounded-[var(--radius-card)] shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-foreground">企业信息</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompanyEdit}
                className="border-border text-muted-foreground hover:border-[var(--color-industrial-blue)] hover:text-[var(--color-industrial-blue)] text-sm px-3 py-1"
              >
                <Edit className="w-3 h-3 mr-1" />
                {isEditing.company ? '保存' : '编辑'}
              </Button>
            </div>

            {/* Company Logo Section */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-2 border-[var(--color-border)] rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                  {companyInfo.companyLogo ? (
                    <img src={companyInfo.companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Building className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                {isEditing.company && (
                  <button
                    onClick={handleLogoUpload}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--color-industrial-blue)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-industrial-blue-dark)] transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Company Fields */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <label className="text-sm text-muted-foreground w-20 pt-1">企业名称</label>
                <div className="flex-1 ml-4">
                  <span className="text-foreground text-sm leading-relaxed">{companyInfo.companyName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-20">信用代码</label>
                <div className="flex-1 ml-4">
                  <span className="text-foreground text-sm font-mono">{formatCreditCode(companyInfo.socialCreditCode)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-20">许可证号</label>
                <div className="flex-1 ml-4">
                  <span className="text-muted-foreground text-sm font-mono">{companyInfo.pollutionPermitNumber}</span>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <label className="text-sm text-muted-foreground w-20 pt-1">地址</label>
                <div className="flex-1 ml-4">
                  {isEditing.company ? (
                    <Textarea
                      value={companyInfo.address}
                      onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                      className="text-sm border-border focus:border-[var(--color-industrial-blue)] bg-input resize-none"
                      rows={2}
                    />
                  ) : (
                    <span className="text-foreground text-sm leading-relaxed">{companyInfo.address}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-20">联系人</label>
                <div className="flex-1 ml-4">
                  {isEditing.company ? (
                    <Input
                      value={companyInfo.contactPerson}
                      onChange={(e) => handleCompanyInfoChange('contactPerson', e.target.value)}
                      className="text-sm border-border focus:border-[var(--color-industrial-blue)] bg-input"
                    />
                  ) : (
                    <span className="text-foreground text-sm">{companyInfo.contactPerson}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-20">联系电话</label>
                <div className="flex-1 ml-4">
                  {isEditing.company ? (
                    <Input
                      value={companyInfo.contactPhone}
                      onChange={(e) => handleCompanyInfoChange('contactPhone', e.target.value)}
                      className="text-sm border-border focus:border-[var(--color-industrial-blue)] bg-input"
                    />
                  ) : (
                    <span className="text-foreground text-sm">{formatPhoneNumber(companyInfo.contactPhone)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - App Information */}
        <div className="bg-card rounded-[var(--radius-card)] shadow-sm border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-6">应用信息</h3>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - App Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-24">版本号</label>
                <div className="flex-1 ml-4">
                  <span className="text-foreground text-sm font-mono">{appInfo.version}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-24">最近更新</label>
                <div className="flex-1 ml-4">
                  <span className="text-muted-foreground text-sm">{appInfo.lastUpdate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-24">构建版本</label>
                <div className="flex-1 ml-4">
                  <span className="text-muted-foreground text-sm font-mono">{appInfo.buildNumber}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Service Status Visualization */}
            <div className="space-y-4">
              {/* Service Cycle Fields - matching left column format */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-24">已服务天数</label>
                <div className="flex-1 ml-4">
                  <span className="text-[var(--color-industrial-blue)] text-sm font-bold">{serviceCycle.daysServed} 天</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-24">剩余天数</label>
                <div className="flex-1 ml-4">
                  <span className="text-muted-foreground text-sm font-semibold">{serviceCycle.daysRemaining} 天</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground w-24">服务期间</label>
                <div className="flex-1 ml-4">
                  <span className="text-muted-foreground text-sm">{serviceCycle.startDate} 至 {serviceCycle.endDate}</span>
                </div>
              </div>


            </div>
          </div>

          {/* Full Width Service Cycle Progress Bar */}
          <div className="mt-8 mb-6">
            {/* Progress Bar Labels */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">服务周期进度</span>
                <span className="text-sm font-semibold text-[var(--color-industrial-blue)]">
                  {serviceCycle.daysServed} / {serviceCycle.totalDays} 天
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[var(--color-industrial-blue)]">
                  {Math.round((serviceCycle.daysServed / serviceCycle.totalDays) * 100)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  剩余 {serviceCycle.daysRemaining} 天
                </span>
              </div>
            </div>
            
            {/* Full Width Progress Bar */}
            <div className="relative">
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--color-industrial-blue)] to-[var(--color-safety-green)] transition-all duration-1000 ease-out relative"
                  style={{ 
                    width: `${Math.min(100, (serviceCycle.daysServed / serviceCycle.totalDays) * 100)}%` 
                  }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
              
              {/* Timeline markers */}
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{serviceCycle.startDate}</span>
                <span className="font-medium text-[var(--color-industrial-blue)]">
                  {new Date().toISOString().split('T')[0]}
                </span>
                <span>{serviceCycle.endDate}</span>
              </div>
            </div>
          </div>

          {/* Check Update Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleCheckUpdate}
              className="bg-industrial-blue hover:bg-industrial-blue-dark text-white px-8 py-2 rounded-[var(--radius-button)] shadow-sm transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              检查更新
            </Button>
          </div>
        </div>
        </div>
      )}
      </div>
    </div>
  );
}
